package com.notononoto

import java.io.FileInputStream
import java.security.{KeyStore, SecureRandom}
import java.util.Properties
import javax.net.ssl.{KeyManagerFactory, SSLContext, TrustManagerFactory}

import akka.actor.ActorSystem
import akka.http.scaladsl.{ConnectionContext, Http, HttpsConnectionContext}
import akka.stream.ActorMaterializer
import com.notononoto.controller.NotononotoController
import resource._

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.io.StdIn


/** Application's entry point */
object Notononoto {

  /** Config of application */
  final case class NotononotoConfig(host: String, port: Integer,
                                    adminLogin: String, adminPassword: String,
                                    useHttps: Boolean,
                                    certPath: String, certPass: String)

  def main(args: Array[String]): Unit = {

    if (args.length < 1) {
      println("Root directory is not passed")
      return
    }
    val root = args(0)

    val configRoot = root + "/conf"
    val config = readProps(configRoot + "/notononoto.properties")

    implicit val system = ActorSystem("ws-actors")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    val controller = NotononotoController(root + "/db")

    val route = RouteFactory.createRoute(
      root + "/webapp", controller, config.adminLogin, config.adminPassword)

    if (config.useHttps) {
      val httpsContext = getHttpsContext(
        config.certPath, config.certPass.toCharArray, configRoot)
      Http().setDefaultServerHttpContext(httpsContext)
    }

    val bindingFuture = Http().bindAndHandle(route, config.host, config.port)

    println(s"Server online at " +
      s"${if (config.useHttps) "https" else "http"}://${config.host}:${config.port}\n" +
      "Press Ctrl-C to stop...")

    // We should terminate system properly when Ctrl-C or SIGTERM events
    // received. When we can properly terminate program from shutdown.sh
    // without complex methods
    Runtime.getRuntime.addShutdownHook(new Thread() {
      override def run(): Unit = {
        println("Shutdown server...")
        Await.result(bindingFuture.flatMap(_.unbind()), 15.second)
        Await.result(system.terminate(), 15.second)
        println("Server is down")
      }
    })

    StdIn.readLine
  }

  /**
    * Prepare https context
    * @param path path to certificate
    * @param password keystore password
    * @param configRoot config folder
    * @return [[HttpsConnectionContext]]
    */
  private def getHttpsContext(path: String,
                              password: Array[Char],
                              configRoot: String): HttpsConnectionContext = {

    val ks: KeyStore = KeyStore.getInstance("PKCS12")
    managed(new FileInputStream(path)) acquireAndGet { is =>
      ks.load(is, password)
    }

    val keyManagerFactory = KeyManagerFactory.getInstance("SunX509")
    keyManagerFactory.init(ks, password)

    val tmf = TrustManagerFactory.getInstance("SunX509")
    tmf.init(ks)

    val sslContext = SSLContext.getInstance("TLS")
    sslContext.init(keyManagerFactory.getKeyManagers, tmf.getTrustManagers,
      new SecureRandom())
    ConnectionContext.https(sslContext)
  }

  /**
    * @param file property file
    * @return application config
    */
  private def readProps(file: String): NotononotoConfig = {
    val props = new Properties()
    managed(new FileInputStream(file)) acquireAndGet { stream =>
      props.load(stream)
      NotononotoConfig(
        props.getProperty("host"),
        props.getProperty("port").toInt,
        props.getProperty("adminLogin"),
        props.getProperty("adminPassword"),
        props.getProperty("useHttps").toBoolean,
        props.getProperty("certPath"),
        props.getProperty("certPass")
      )
    }
  }
}

