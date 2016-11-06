package com.notononoto

import java.io.FileInputStream
import java.util.Properties

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.notononoto.controler.NotononotoController
import resource._

import scala.io.StdIn


object Notononoto {

  final case class NotononotoConfig(host: String, port: Integer,
                                    adminLogin: String, adminPassword: String)

  def main(args: Array[String]): Unit = {

    if (args.length < 1) {
      println("Root directory is not passed")
      return
    }
    val root = args(0)

    val config = readProps(root + "/conf/notononoto.properties")

    implicit val system = ActorSystem("ws-actors")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    val controller = NotononotoController(root + "/db")

    val route = RouteFactory.createRoute(
      root + "/webapp", controller, config.adminLogin, config.adminPassword)
    val bindingFuture = Http().bindAndHandle(route, config.host, config.port)

    println(s"Server online at http://${config.host}:${config.port}\n" +
            "Press RETURN to stop...")
    StdIn.readLine()

    bindingFuture.flatMap(_.unbind()).onComplete(_ => {
      println("Shutdown server...")
      system.terminate()
    })
  }

  private def readProps(file: String): NotononotoConfig = {
    val props = new Properties()
    managed(new FileInputStream(file)) acquireAndGet { stream =>
      props.load(stream)
      NotononotoConfig(
        props.getProperty("host"),
        props.getProperty("port").toInt,
        props.getProperty("adminLogin"),
        props.getProperty("adminPassword")
      )
    }
  }
}

