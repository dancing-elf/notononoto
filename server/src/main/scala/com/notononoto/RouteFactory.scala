package com.notononoto

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.{RejectionHandler, Route}
import com.notononoto.storage.{Comment, Post, StorageStub}
import spray.json._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.server.directives.Credentials
import com.typesafe.scalalogging.Logger
import org.slf4j.LoggerFactory


/** Factory for application routing */
object RouteFactory {

  private val log = Logger(LoggerFactory.getLogger(this.getClass))

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
  import JsonProtocol._

  /** Check admin password */
  def passAuthenticator(credentials: Credentials): Option[String] =
    credentials match {
      case p @ Credentials.Provided(id)
        if id == "admin" && p.verify("admin") => Some(id)
      case _ => None
    }

  /**
    * Create web route
    * @param webRoot directory with frontend's content
    */
  def createRoute(webRoot: String): Route = {

    // Only existed postId can be handled
    val IntNumberExists = IntNumber
      .flatMap(id => if (isPostExists(id)) Some(id) else None)

    pathPrefix("api") {
      respondWithHeaders(
        `Access-Control-Allow-Origin`.*,
        `Cache-Control`(CacheDirectives.`no-cache`)) {
        handleRejections(RejectionHandler.default) {
          pathPrefix("public") {
            get {
              path("posts") {
                complete(jsonResponse(StorageStub.loadPosts().toJson))
              } ~
                path("post" / IntNumberExists) { postId =>
                  val (post, comments) = StorageStub.loadPost(postId)
                  complete(jsonResponse(PostData(post, comments).toJson))
                }
            } ~
            post {
              (path("new_comment") & entity(as[JsValue])) {
                (json) => {
                  val obj = json.asJsObject
                  val postIdLong = jsonField(obj, "postId").toLong
                  StorageStub.addComment(postIdLong, jsonField(obj, "author"),
                    jsonField(obj, "email"), jsonField(obj, "text"))
                  val comments = StorageStub.loadComments(postIdLong)
                  complete(jsonResponse(comments.toJson))
                }
              }
            }
          } ~
          pathPrefix("admin") {
            authenticateBasic(realm = "admin part", passAuthenticator) { user =>
              get {
                path("login") {
                  log.debug("success")
                  complete("Success")
                } ~
                  path("posts") {
                    log.debug("request received")
                    complete(jsonResponse(StorageStub.loadPosts().toJson))
                  }
              }
            }
          }
        }
      }
    } ~
    (get & path("bundle.js")) {
      getFromFile(webRoot + "/public.js")
    } ~
    (get & path("favicon.png")) {
      getFromFile(webRoot + "/favicon.png")
    } ~
    get {
      getFromFile(webRoot + "/index.html")
    }
  }

  private def jsonField(obj: JsObject, name: String): String = {
    obj.fields(name).convertTo[String]
  }

  private def isPostExists(id: Integer): Boolean = {
    id > 0 && id < StorageStub.getPostCount
  }

  private def jsonResponse(json: JsValue): HttpResponse = {
    HttpResponse(entity=
      HttpEntity(ContentTypes.`application/json`, json.compactPrint))
  }
}
