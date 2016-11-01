package com.notononoto

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.stream.ActorMaterializer
import com.notononoto.dao.NotononotoDao

import scala.io.StdIn

object Notononoto {

  def main(args: Array[String]): Unit = {

    if (args.length < 1) {
      println("Root directory is not passed")
      return
    }
    val webRoot = args(0) + "/webapp"
    val dbRoot = args(0) + "/db"

    implicit val system = ActorSystem("ws-actors")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    NotononotoDao.prepare(dbRoot)

    val bindingFuture = Http().bindAndHandle(
      RouteFactory.createRoute(webRoot), "localhost", 8080)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()

    bindingFuture.flatMap(_.unbind()).onComplete(_ => {
      println("Shutdown server...")
      system.terminate()
    })
 
  }
}

