package com.notononoto

import java.io.FileInputStream
import java.util.Properties

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.notononoto.dao.NotononotoDaoCreator

import scala.io.StdIn
import resource._


object Notononoto {

  implicit val system = ActorSystem("ws-actors")
  implicit val materializer = ActorMaterializer()
  implicit val executionContext = system.dispatcher

  final case class NotononotoConfig(host: String, port: Integer,
                                    adminLogin: String, adminPassword: String)

  def main(args: Array[String]): Unit = {

    if (args.length < 1) {
      println("Root directory is not passed")
      return
    }
    val root = args(0)

    val config: NotononotoConfig = readProps(root + "/conf/notononoto.properties")
    val daoCreator = NotononotoDaoCreator(root + "/db")
    val route = RouteFactory.createRoute(
      root + "/webapp", daoCreator, config.adminLogin, config.adminPassword)
    val bindingFuture = Http().bindAndHandle(route, config.host, config.port)

    println("Server online at http://" + config.host + ":" + config.port +
      "/\nPress RETURN to stop...")
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

