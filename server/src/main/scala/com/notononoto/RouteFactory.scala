package com.notononoto

import java.time.LocalDateTime

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.directives.Credentials
import akka.http.scaladsl.server.{RejectionHandler, Route}
import com.notononoto.controller.NotononotoController
import com.notononoto.dao.{Comment, Post}
import com.notononoto.util.ConverterUtils
import com.typesafe.scalalogging.Logger
import org.slf4j.LoggerFactory
import spray.json._

import scala.concurrent.Await
import scala.concurrent.duration._
import scala.util.{Failure, Success}


/** Factory for application routing */
object RouteFactory {

  private val log = Logger(LoggerFactory.getLogger(this.getClass))

  /** Requests */
  final case class NewCommentRequest(postId: Long, author: String, email: String, text: String)
  final case class NewPostRequest(header: String, content: String)
  final case class UpdatePostRequest(postId: Long, header: String, content: String)
  /** Responses */
  final case class PostData(post: Post, comments: List[Comment])

  object JsonProtocol extends DefaultJsonProtocol {

    /** LocalDateTime formater */
    implicit object DateJsonFormat extends RootJsonFormat[LocalDateTime] {
      def write(dateTime: LocalDateTime) = JsString(ConverterUtils.dateToString(dateTime))
      def read(value: JsValue) =
        throw new NotImplementedError("Read of LocalDateTime not supported")
    }

    implicit val postProtocol = jsonFormat4(Post)
    implicit val commentProtocol = jsonFormat7(Comment)
    implicit val postDataProtocol = jsonFormat2(PostData)
    implicit val newCommentRequest = jsonFormat4(NewCommentRequest)
    implicit val newPostRequest = jsonFormat2(NewPostRequest)
    implicit val updatePostRequest = jsonFormat3(UpdatePostRequest)
  }

  import JsonProtocol._

  /**
    * Create web route
    * @param webRoot directory with frontend's content
    * @param controller controller
    * @param adminLogin admin login
    * @param adminPassword admin password
    * @return [[Route]]
    */
  def createRoute(webRoot: String, controller: NotononotoController,
                  adminLogin: String, adminPassword: String): Route = {

    // Only existed postId can be handled
    val IntNumberExists = IntNumber
      .flatMap(id => if (controller.isPostExists(id)) Some(id) else None)
    // admin part guard
    val authenticator = createAuthenticator(adminLogin, adminPassword)

    pathPrefix("api") {
      respondWithHeaders(`Access-Control-Allow-Origin`.*) {
        handleRejections(RejectionHandler.default) {
          pathPrefix("public") {
            get {
              path("posts") {
                complete {
                  controller.getPublicPostsList
                }
              } ~
              path("post" / IntNumberExists) { postId =>
                complete {
                  val (post, comments) = controller.getPublicPostData(postId)
                  PostData(post, comments)
                }
              }
            } ~
            post {
              (path("new_comment") & entity(as[NewCommentRequest])) {
                (req) => {
                  complete {
                    if (controller.isValidAuthor(req.author) &&
                        controller.isValidEmail(req.email) &&
                        controller.isValidText(req.text)) {
                      controller.addComment(
                        req.postId, req.author, req.email, req.text)
                    } else {
                      HttpResponse(StatusCodes.BadRequest)
                    }
                  }
                }
              }
            }
          } ~
          pathPrefix("admin") {
            authenticateBasic(realm = "admin part", authenticator) { user =>
              get {
                path("login") {
                  complete {
                    log.debug("successfully logged")
                    "Successfully logged"
                  }
                } ~
                path("posts") {
                  complete {
                    controller.getAdminPostsList
                  }
                } ~
                path("post" / IntNumberExists) { postId =>
                  complete {
                    val (post, comments) = controller.getAdminPostData(postId)
                    PostData(post, comments)
                  }
                } ~
                path("upload_file" / IntNumber) { postId =>
                  complete {
                    controller.getUploadedFiles(postId)
                  }
                }
              } ~
              post {
                (path("new_post") & entity(as[NewPostRequest])) {
                  (req) => {
                    complete {
                      controller.createPost(req.header, req.content)
                      HttpResponse(StatusCodes.OK)
                    }
                  }
                } ~
                (path("update_post") & entity(as[UpdatePostRequest])) {
                  (req) => {
                    complete {
                      controller.updatePost(req.postId, req.header, req.content)
                      HttpResponse(StatusCodes.OK)
                    }
                  }
                } ~
                (path("upload_file" / IntNumberExists) & fileUpload("file")) {
                  case (postId, (fileInfo, fileStream)) =>
                    complete {
                      val future = controller.uploadFile(postId, fileInfo, fileStream)
                      val result = Await.result(future, 30.second)
                      result.status match {
                        case Success(_) => HttpResponse(StatusCodes.OK)
                        case Failure(e) => throw e
                      }
                    }
                }
              }
            }
          }
        }
      }
    } ~
    get {
      pathPrefix("res") {
        getFromDirectory(controller.getResPath.toString)
      } ~
      // bundle can contain application version
      pathPrefixTest("bundle") {
        // allow to send gzip if client support it
        encodeResponse {
          getFromDirectory(webRoot)
        }
      } ~
      path("favicon.png") {
        getFromFile(webRoot + "/favicon.png")
      }
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
}
