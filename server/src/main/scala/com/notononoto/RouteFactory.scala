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

  /** Information about post */
  final case class PostData(post: Post, comments: List[Comment])

  object JsonProtocol extends DefaultJsonProtocol {

    /** Format of date for sending to client */
    val format = DateTimeFormatter.ofPattern("HH-mm-ss dd-MM-yyyy")
    /** ZonedDateTime formater */
    implicit object DateJsonFormat extends RootJsonFormat[ZonedDateTime] {
      def write(dateTime: ZonedDateTime) = JsString(format.format(dateTime))
      def read(value: JsValue) =
        throw new NotImplementedError("Read of ZonedDateTime not supported")
    }

    /** Json provider for posts */
    implicit val postProtocol = jsonFormat5(Post)
    /** Json provider for comments */
    implicit val commentProtocol = jsonFormat5(Comment)
    /** Json provider for PostData */
    implicit val postDataProtocol = jsonFormat2(PostData)
  }

  /**
    * Create web route
    * @param webRoot directory with frontend's content
    */
  def createRoute(webRoot: String): Route = {

    import JsonProtocol._

    // Only existed postId can be handled
    val IntNumberExists = IntNumber
      .flatMap(id => if (isPostExists(id)) Some(id) else None)

    (get & respondWithHeaders(
      `Access-Control-Allow-Origin`.*,
      `Cache-Control`(CacheDirectives.`no-cache`))) {
      path("api" / "posts") {
        complete(jsonResponse(StorageStub.loadPosts().toJson))
      } ~
      path("api" / "post" / IntNumberExists) { postId =>
        val (post, comments) = StorageStub.loadPost(postId)
        complete(jsonResponse(PostData(post, comments).toJson))
      }
    } ~
    (get & path("bundle.js")) {
      getFromFile(webRoot + "/bundle.js")
    } ~
    get {
      getFromFile(webRoot + "/index.html")
    }
  }

  private def isPostExists(id: Integer): Boolean = {
    id > 0 && id < StorageStub.getPostCount
  }

  private def jsonResponse(json: JsValue): HttpResponse = {
    HttpResponse(entity=
      HttpEntity(ContentTypes.`application/json`, json.compactPrint))
  }
}
