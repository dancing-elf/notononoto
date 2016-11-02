package com.notononoto

import java.time.LocalDateTime

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.directives.Credentials
import akka.http.scaladsl.server.{RejectionHandler, Route}
import com.notononoto.dao.{Comment, NotononotoDao, NotononotoDaoCreator, Post}
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

  /**
    * Create web route
    * @param webRoot directory with frontend's content
    * @param daoCreator database dao manager
    * @param adminLogin admin login
    * @param adminPassword admin password
    * @return [[Route]]
    */
  def createRoute(webRoot: String, daoCreator: NotononotoDaoCreator,
                  adminLogin: String, adminPassword: String): Route = {

    // Only existed postId can be handled
    val IntNumberExists = IntNumber
      .flatMap(id => if (isPostExists(id, daoCreator)) Some(id) else None)
    // admin part guard
    val authenticator = createAuthenticator(adminLogin, adminPassword)

    pathPrefix("api") {
      respondWithHeaders(
        `Access-Control-Allow-Origin`.*,
        `Cache-Control`(CacheDirectives.`no-cache`)) {
        handleRejections(RejectionHandler.default) {
          pathPrefix("public") {
            get {
              path("posts") {
                managed(daoCreator.create()) acquireAndGet { dao =>
                  val posts = dao.loadPosts()
                  complete(jsonResponse(posts.toJson))
                }
              } ~
              path("post" / IntNumberExists) { postId =>
                managed(daoCreator.create()) acquireAndGet { dao =>
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
                  managed(daoCreator.create()) acquireAndGet { dao =>
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
            authenticateBasic(realm = "admin part", authenticator) { user =>
              get {
                path("login") {
                  log.debug("success")
                  complete("Success")
                } ~
                path("posts") {
                  log.debug("request received")
                  managed(daoCreator.create()) acquireAndGet { dao =>
                    val posts = dao.loadPosts()
                    complete(jsonResponse(posts.toJson))
                  }
                } ~
                path("post" / IntNumberExists) { postId =>
                  managed(daoCreator.create()) acquireAndGet { dao =>
                    val (post, comments) = dao.loadPost(postId)
                    complete(jsonResponse(PostData(post, comments).toJson))
                  }
                }
              } ~
              post {
                (path("new_post") & entity(as[JsValue])) {
                  (json) => {
                    val obj = json.asJsObject
                    managed(daoCreator.create()) acquireAndGet { dao =>
                      dao.createPost(jsonField(obj, "header"),
                                     jsonField(obj, "content"))
                    }
                    complete("Success")
                  }
                } ~
                (path("update_post") & entity(as[JsValue])) {
                  (json) => {
                    val obj = json.asJsObject
                    managed(daoCreator.create()) acquireAndGet { dao =>
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

  /**
    * @param login admin login
    * @param password admin password
    * @return object for checking admin login and password
    */
  private def createAuthenticator(login: String,
                                  password: String): Authenticator[String] = {
    case p@Credentials.Provided(id)
      if id == login && p.verify(password) => Some(id)
    case _ => None
  }

  private def isPostExists(id: Long,
                           daoCreator: NotononotoDaoCreator): Boolean = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.isPostExists(id)
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
