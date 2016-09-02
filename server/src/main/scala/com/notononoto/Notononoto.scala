package com.notononoto

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Paths}

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.server.Directives._
import akka.stream.ActorMaterializer
import spray.json._

import scala.io.{Codec, StdIn}


final case class Comment(id: Long, author: String, text: String)

object CommentJsonProtocol extends DefaultJsonProtocol {
  implicit val commentProtocol = jsonFormat3(Comment)
}

object Notononoto {

  import CommentJsonProtocol._

  /** File with persistent json data */
  val COMMENTS_FILE = "./comments.json"
  /** Directory with static content */
  val STATIC_DIR = "./public"

  val route =
    path("api" / "comments") {
      respondWithHeaders(`Access-Control-Allow-Origin`.*,
                         `Cache-Control`(CacheDirectives.`no-cache`)) {
        implicit val codec = Codec.UTF8
        // lock here is required
        val commentsData = io.Source.fromFile(COMMENTS_FILE).mkString
        get {
          complete(HttpEntity(ContentTypes.`application/json`, commentsData))
        } ~
        (post & formFields('author, 'text)) {
          (author, text) =>
            val comment = Comment(System.nanoTime(), author, text)
            val oldComments = commentsData.parseJson.convertTo[Array[Comment]]
            val newComments = oldComments :+ comment
            val newCommentsData = newComments.toJson.compactPrint
            Files.write(Paths.get(COMMENTS_FILE),
                        newCommentsData.getBytes(StandardCharsets.UTF_8))
            complete(HttpEntity(ContentTypes.`application/json`, newCommentsData))
        }
      }
    } ~
    pathSingleSlash {
      getFromFile(STATIC_DIR + "/index.html")
    } ~
    get {
      getFromDirectory(STATIC_DIR)
    }

  def main(args: Array[String]): Unit = {

    implicit val system = ActorSystem("ws-actors")
    implicit val materializer = ActorMaterializer()
    implicit val executionContext = system.dispatcher

    val bindingFuture = Http().bindAndHandle(route, "localhost", 8080)

    println(s"Server online at http://localhost:8080/\nPress RETURN to stop...")
    StdIn.readLine()

    bindingFuture.flatMap(_.unbind()).onComplete(_ => system.terminate())
  }
}
