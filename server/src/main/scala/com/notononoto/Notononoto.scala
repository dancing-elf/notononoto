package com.notononoto

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.notononoto.dao.NotononotoDaoCreator

import scala.io.StdIn

object Notononoto {

  def main(args: Array[String]): Unit = {

    if (args.length < 1) {
      println("Root directory is not passed")
      return
    }
    val root = args(0)

    implicit val system = ActorSystem("ws-actors")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    val daoCreator = NotononotoDaoCreator(root + "/db")

    val bindingFuture = Http().bindAndHandle(
      RouteFactory.createRoute(root + "/webapp", daoCreator), "localhost", 8080)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()

    bindingFuture.flatMap(_.unbind()).onComplete(_ => {
      println("Shutdown server...")
      system.terminate()
    })
 
  }
}

