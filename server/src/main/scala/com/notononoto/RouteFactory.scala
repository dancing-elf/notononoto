package com.notononoto

import java.nio.charset.StandardCharsets
import java.nio.file.{Files, Paths}

import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpRequest, HttpResponse}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import akka.stream.scaladsl.Flow
import spray.json._

import scala.io.Codec


final case class Comment(id: Long, author: String, text: String)

object CommentJsonProtocol extends DefaultJsonProtocol {
  implicit val commentProtocol = jsonFormat3(Comment)
}

/**
  * Factory for application routing
  *
  * @author dancing-elf
  *         9/4/16.
  */
object RouteFactory {

  import CommentJsonProtocol._

  val COMMENTS_FILE = "./comments.json"

  /**
    * Create web route
    *
    * @param webRoot directory with frontend's content
    */
  def createRoute(webRoot: String): Route = {

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
      getFromFile(webRoot + "/index.html")
    } ~
    get {
      getFromDirectory(webRoot)
    }
  }
}
