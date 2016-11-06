package com.notononoto.controler

import java.nio.file.{Files, Path, Paths}

import akka.http.scaladsl.server.directives.FileInfo
import akka.stream.scaladsl.{FileIO, Source}
import akka.stream.{IOResult, Materializer}
import akka.util.ByteString
import com.notononoto.dao.{Comment, NotononotoDaoCreator, Post}
import resource._

import scala.concurrent.Future


/**
  * Implementation of routing methods
  */
class NotononotoController(daoCreator: NotononotoDaoCreator, dbRoot: String)
                          (implicit materializer: Materializer) {

  /** Pattern for checking email */
  private val EMAIL_PATTERN = """^[^\s@]+@[^\s@]+\.[^\s@]+$""".r.pattern
  /** Custom tag to separate post opening from post continuation */
  private val NOTONONOTOCUT = "<notononotocut/>"


  def getPublicPostsList: List[Post] = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      // A little bit ugly, but if there will be performance
      // problems simple cache will solve it. We need cache here
      // in any case, because database requests here. So no reason
      // to make very complex data model
      dao.loadPosts().map(post =>
        Post(post.id, post.timestamp, post.header,
          getOpening(post.content))).reverse
    }
  }

  def getPublicPostData(postId: Long): (Post, List[Comment]) = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      val (post, comments) = dao.loadPost(postId)
      // see comment in getPublicPostsList method
      val postView = Post(post.id, post.timestamp, post.header,
        removeCut(post.content))
      // hide email address from client
      val commentsView = comments.map(c =>
        Comment(c.id, c.postId, c.number, c.timestamp, c.author, "", c.text))
      (postView, commentsView)
    }
  }

  def getAdminPostsList: List[Post] = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.loadPosts()
    }
  }

  def getAdminPostData(postId: Long): (Post, List[Comment]) = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.loadPost(postId)
    }
  }

  def isValidAuthor(author: String): Boolean = {
    !author.isEmpty && author.length <= 50
  }

  def isValidText(text: String): Boolean = {
    !text.isEmpty && text.length <= 1000
  }

  def isValidEmail(email: String): Boolean = {
    email.length <= 50 && EMAIL_PATTERN.matcher(email).matches()
  }

  def addComment(postId: Long, author: String,
                 email: String, text: String): List[Comment] = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.addComment(postId, author, email, text)
      dao.loadComments(postId)
    }
  }

  def updatePost(postId: Long, header: String, content: String): Unit = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.updatePost(postId, header, content)
    }
  }

  def createPost(header: String, content: String): Unit = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.createPost(header, content)
    }
  }

  def getUploadedFiles(postId: Long): List[String] = {
    val path = getPostResPath(postId)
    if (Files.exists(path)) {
      path.toFile.listFiles.toList.map(_.getName())
    } else {
      List[String]()
    }
  }

  def uploadFile(postId: Long, fileInfo: FileInfo,
                 fileStream: Source[ByteString, Any]): Future[IOResult] = {
    val dir = getPostResPath(postId)
    if (Files.notExists(dir)) {
      this.synchronized {
        Files.createDirectories(dir)
      }
    }
    val file = dir.resolve(fileInfo.fileName)
    fileStream.runWith(FileIO.toPath(file))
  }

  def isPostExists(id: Long): Boolean = {
    managed(daoCreator.create()) acquireAndGet { dao =>
      dao.isPostExists(id)
    }
  }

  private def getOpening(content: String): String = {
    content.split(NOTONONOTOCUT)(0)
  }

  private def removeCut(content: String): String = {
    content.replaceFirst(NOTONONOTOCUT, "")
  }

  private def getPostResPath(postId: Long): Path = {
    getResPath.resolve(postId.toString)
  }

  def getResPath: Path = {
    Paths.get(dbRoot).resolve("res")
  }
}

object NotononotoController {

  def apply(dbRoot: String)(implicit materializer: Materializer): NotononotoController = {
    val daoCreator = NotononotoDaoCreator(dbRoot)
    new NotononotoController(daoCreator, dbRoot)
  }
}