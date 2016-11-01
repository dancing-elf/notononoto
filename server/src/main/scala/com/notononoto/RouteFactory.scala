package com.notononoto

import java.time.LocalDateTime

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.directives.Credentials
import akka.http.scaladsl.server.{RejectionHandler, Route}
import com.notononoto.dao.{Comment, NotononotoDao, Post}
import com.notononoto.util.ConverterUtils
import com.typesafe.scalalogging.Logger
import org.slf4j.LoggerFactory
import resource._
import spray.json._


/** Factory for application routing */
object RouteFactory {

  private val log = Logger(LoggerFactory.getLogger(this.getClass))

  /** Information about post */
  final case class PostData(post: Post, comments: List[Comment])

  object JsonProtocol extends DefaultJsonProtocol {

    /** LocalDateTime formater */
    implicit object DateJsonFormat extends RootJsonFormat[LocalDateTime] {
      def write(dateTime: LocalDateTime) = JsString(ConverterUtils.dateToString(dateTime))
      def read(value: JsValue) =
        throw new NotImplementedError("Read of ZonedDateTime not supported")
    }

    /** Json provider for posts */
    implicit val postProtocol = jsonFormat4(Post)
    /** Json provider for comments */
    implicit val commentProtocol = jsonFormat6(Comment)
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

    def isPostExists(id: Long): Boolean = {
      managed(NotononotoDao()) acquireAndGet { dao =>
        id > 0 && id <= dao.getPostCount
      }
    }
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
                managed(NotononotoDao()) acquireAndGet { dao =>
                  val posts = dao.loadPosts()
                  complete(jsonResponse(posts.toJson))
                }
              } ~
              path("post" / IntNumberExists) { postId =>
                managed(NotononotoDao()) acquireAndGet { dao =>
                  val (post, comments) = dao.loadPost(postId)
                  complete(jsonResponse(PostData(post, comments).toJson))
                }
              }
            } ~
            post {
              (path("new_comment") & entity(as[JsValue])) {
                (json) => {
                  val obj = json.asJsObject
                  val postIdLong = jsonField(obj, "postId").toLong
                  managed(NotononotoDao()) acquireAndGet { dao =>
                    dao.addComment(postIdLong, jsonField(obj, "author"),
                      jsonField(obj, "email"), jsonField(obj, "text"))
                    val comments = dao.loadComments(postIdLong)
                    complete(jsonResponse(comments.toJson))
                  }
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
                  managed(NotononotoDao()) acquireAndGet { dao =>
                    val posts = dao.loadPosts()
                    complete(jsonResponse(posts.toJson))
                  }
                } ~
                path("post" / IntNumberExists) { postId =>
                  managed(NotononotoDao()) acquireAndGet { dao =>
                    val (post, comments) = dao.loadPost(postId)
                    complete(jsonResponse(PostData(post, comments).toJson))
                  }
                }
              } ~
              post {
                (path("new_post") & entity(as[JsValue])) {
                  (json) => {
                    val obj = json.asJsObject
                    managed(NotononotoDao()) acquireAndGet { dao =>
                      dao.createPost(jsonField(obj, "header"),
                                     jsonField(obj, "content"))
                    }
                    complete("Success")
                  }
                } ~
                (path("update_post") & entity(as[JsValue])) {
                  (json) => {
                    val obj = json.asJsObject
                    managed(NotononotoDao()) acquireAndGet { dao =>
                      dao.updatePost(jsonField(obj, "postId").toLong,
                                     jsonField(obj, "header"),
                                     jsonField(obj, "content"))
                      complete("Success")
                    }
                  }
                }
              }
            }
          }
        }
      }
    } ~
    (get & path("bundle.js")) {
      getFromFile(webRoot + "/bundle.js")
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

  private def jsonResponse(json: JsValue): HttpResponse = {
    HttpResponse(entity=
      HttpEntity(ContentTypes.`application/json`, json.compactPrint))
  }
}
