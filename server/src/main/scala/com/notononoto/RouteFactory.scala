package com.notononoto

import java.nio.file.{Files, Path, Paths}
import java.time.LocalDateTime

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.headers._
import akka.http.scaladsl.model.{ContentTypes, HttpEntity, HttpResponse, StatusCodes}
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.directives.Credentials
import akka.http.scaladsl.server.{RejectionHandler, Route}
import akka.stream.scaladsl.FileIO
import com.notononoto.dao.{Comment, NotononotoDaoCreator, Post}
import com.notononoto.util.ConverterUtils
import com.typesafe.scalalogging.Logger
import org.slf4j.LoggerFactory
import resource._
import spray.json._
import com.notononoto.Notononoto._

import scala.util.{Failure, Success}


/** Factory for application routing */
object RouteFactory {

  /** Custom tag to separate post opening from post continuation */
  private val NOTONONOTOCUT = "<notononotocut/>"
  /** Pattern for checking email */
  private val EMAIL_PATTERN = """^[^\s@]+@[^\s@]+\.[^\s@]+$""".r.pattern

  private val log = Logger(LoggerFactory.getLogger(this.getClass))

  /** Information about post */
  final case class PostData(post: Post, comments: List[Comment])

  object JsonProtocol extends DefaultJsonProtocol {

    /** LocalDateTime formater */
    implicit object DateJsonFormat extends RootJsonFormat[LocalDateTime] {
      def write(dateTime: LocalDateTime) = JsString(ConverterUtils.dateToString(dateTime))
      def read(value: JsValue) =
        throw new NotImplementedError("Read of LocalDateTime not supported")
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
                  // A little bit ugly, but if there will be performance
                  // problems simple cache will solve it. We need cache here
                  // in any case, because database requests here. So no reason
                  // to make very complex data model
                  val posts = dao.loadPosts().map(post =>
                    Post(post.id, post.timestamp, post.header,
                      getOpening(post.content))).reverse
                  complete(jsonResponse(posts.toJson))
                }
              } ~
              path("post" / IntNumberExists) { postId =>
                managed(daoCreator.create()) acquireAndGet { dao =>
                  val (post, comments) = dao.loadPost(postId)
                  // see comment to /api/public/posts requests
                  val postView = Post(post.id, post.timestamp, post.header,
                      removeCut(post.content))
                  // hide email address from client
                  val commentsView = comments.map(c =>
                    Comment(c.id, c.postId, c.timestamp, c.author, "", c.text))
                  complete(jsonResponse(PostData(postView, commentsView).toJson))
                }
              }
            } ~
            post {
              (path("new_comment") & entity(as[JsValue])) {
                (json) => {
                  val obj = json.asJsObject
                  val postIdLong = jsonField(obj, "postId").toLong
                  val author = jsonField(obj, "author")
                  val email = jsonField(obj, "email")
                  val text = jsonField(obj, "text")
                  if (isValidAuthor(author) && isValidEmail(email) && isValidText(text)) {
                    managed(daoCreator.create()) acquireAndGet { dao =>
                      dao.addComment(postIdLong, author, email, text)
                      val comments = dao.loadComments(postIdLong)
                      complete(jsonResponse(comments.toJson))
                    }
                  } else {
                    complete(HttpResponse(StatusCodes.BadRequest))
                  }
                }
              }
            }
          } ~
          pathPrefix("admin") {
            authenticateBasic(realm = "admin part", authenticator) { user =>
              get {
                path("login") {
                  log.debug("successful login")
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
                } ~
                path("upload_file" / IntNumber) { postId =>
                  val path = getFullResPath(postId, webRoot)
                  if (Files.exists(path)) {
                    val files = path.toFile.listFiles.toList.map(_.getName())
                    complete(jsonResponse(files.toJson))
                  } else {
                    complete(jsonResponse(List[String]().toJson))
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
                } ~
                (path("upload_file" / IntNumberExists) & fileUpload("file")) {
                  case (postId, (fileInfo, fileStream)) =>
                    val dir = getFullResPath(postId, webRoot)
                    if (Files.notExists(dir)) {
                      this.synchronized {
                        Files.createDirectories(dir)
                      }
                    }
                    val file = dir.resolve(fileInfo.fileName)
                    log.debug("try write file: {}", file)
                    val writeResult = fileStream.runWith(FileIO.toPath(file))
                    onSuccess(writeResult) { result =>
                      result.status match {
                        case Success(_) => complete("Success")
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
    (get & pathPrefix("res")) {
      getFromDirectory(getResPath(webRoot).toString)
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

  private def isValidAuthor(author: String): Boolean = {
    !author.isEmpty && author.length <= 50
  }

  private def isValidText(text: String): Boolean = {
    !text.isEmpty && text.length <= 1000
  }

  private def isValidEmail(email: String): Boolean = {
    email.length <= 50 && EMAIL_PATTERN.matcher(email).matches()
  }

  private def getFullResPath(postId: Long, webRoot: String): Path = {
    getResPath(webRoot).resolve(postId.toString)
  }

  private def getResPath(webRoot: String): Path = {
    Paths.get(webRoot).resolve("../db/res")
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

  private def getOpening(content: String): String = {
    content.split(NOTONONOTOCUT)(0)
  }

  private def removeCut(content: String): String = {
    content.replaceFirst(NOTONONOTOCUT, "")
  }
}
