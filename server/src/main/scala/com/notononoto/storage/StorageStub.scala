package com.notononoto.storage

import java.time.ZonedDateTime

import scala.io.Source


/** Information about post */
final case class Post(id: Long,
                      timestamp: ZonedDateTime,
                      header: String,
                      content: String,
                      previewPos: Int)

/** Information about comments to post */
final case class Comment(id: Long,
                         timestamp: ZonedDateTime,
                         parentId: Option[Long],
                         author: String,
                         text: String)

/** Stub for db operations until database will be selected */
object StorageStub {

  private var commentList = List(
    Comment(1, ZonedDateTime.now(), None, "Flash", "First comment"),
    Comment(2, ZonedDateTime.now(), None, "Jaydong", "Second comment"),
    Comment(3, ZonedDateTime.now(), Some(2), "Zest", "Third comment")
  )

  /**
    * @return list of posts
    */
  def loadPosts(): List[Post] = {
    List(
      Post(1, ZonedDateTime.now(), "Java language", read("java_post.txt"), 50),
      Post(2, ZonedDateTime.now(), "Kotlin", read("kotlin_post.txt"), 25),
      Post(3, ZonedDateTime.now(), "Rust language", read("rust_post.txt"), 70),
      Post(4, ZonedDateTime.now(), "Scala lang", read("scala_post.txt"), 60)
    )
  }

  /**
    * @param id identifier of post
    * @return post data and list of it's comments
    */
  def loadPost(id: Long): (Post, List[Comment]) = {
    (Post(1, ZonedDateTime.now(), "Java language", read("java_post.txt"), 50),
      loadComments(1))
  }

  /**
    * @return number of posts
    */
  def getPostCount: Integer = {
    4
  }

  def addComment(postId: Long,
                 author: String,
                 email: String,
                 text: String): Unit = {
    val newComment = Comment(commentList.size + 1, ZonedDateTime.now(),
                             None, author, text)
    commentList = commentList :+ newComment
  }

  /**
    * @param postId identifier of post
    * @return list of comments for post
    */
  def loadComments(postId: Long): List[Comment] = {
    commentList
  }

  private def read(name: String): String = {
    val resource = getClass.getResourceAsStream("/" + name)
    try {
      Source.fromInputStream(resource).getLines.mkString
    } finally {
      resource.close()
    }
  }
}
