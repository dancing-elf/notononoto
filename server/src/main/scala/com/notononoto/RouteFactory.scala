package com.notononoto

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.Route
import com.notononoto.storage.{Comment, Post, StorageStub}
import spray.json._

/** Factory for application routing */
object RouteFactory {

  object JsonProtocol extends DefaultJsonProtocol {

    /** Format of date for sending to client */
    val format = DateTimeFormatter.ofPattern("dd-MM-yyyy")
    /** ZonedDateTime formater */
    implicit object DateJsonFormat extends RootJsonFormat[ZonedDateTime] {
      def write(dateTime: ZonedDateTime) = JsString(format.format(dateTime))
      def read(value: JsValue) =
        throw new NotImplementedError("Read of ZonedDateTime not supported")
    }

    /** Json provider for posts */
    implicit val postProtocol = jsonFormat5(Post)
    /** Json provider for comments */
    implicit val commentProtocol = jsonFormat4(Comment)
  }

  import JsonProtocol._

  /**
    * Create web route
    * @param webRoot directory with frontend's content
    */
  def createRoute(webRoot: String): Route = {

    (get & respondWithHeaders(
      `Access-Control-Allow-Origin`.*,
      `Cache-Control`(CacheDirectives.`no-cache`))) {
      path("api" / "posts") {
        complete(jsonResponse(StorageStub.loadPosts().toJson))
      } ~
      (path("api" / "comments") & parameter('post)) { post =>
        complete(jsonResponse(StorageStub.loadComments(post.toInt).toJson))
      }
    } ~
    pathSingleSlash {
      getFromFile(webRoot + "/index.html")
    } ~
    get {
      getFromDirectory(webRoot)
    }
  }

  private def jsonResponse(json: JsValue): HttpResponse = {
    HttpResponse(entity=
      HttpEntity(ContentTypes.`application/json`, json.compactPrint))
  }
}
