package com.notononoto

import java.nio.file.Files

import com.notononoto.dao.{Comment, NotononotoDao, NotononotoDaoCreator, Post}
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.{BeforeAndAfterAll, Matchers, WordSpec}


/** Test persistence layer */
@RunWith(classOf[JUnitRunner])
class NotononotoDaoTest extends WordSpec with Matchers with BeforeAndAfterAll {

  val tempFile = Files.createTempDirectory(null)
  val daoCreator = NotononotoDaoCreator(tempFile.toString)
  val dao: NotononotoDao = daoCreator.create()

  override def afterAll() = {
    dao.close()
  }

  "The dao" should {
    "correctly handle posts and comments" in {
      /** Insert posts*/
      dao.createPost("header1", "content1")
      dao.createPost("header2", "content2")

      dao.isPostExists(1) shouldEqual true
      dao.isPostExists(2) shouldEqual true
      dao.isPostExists(0) shouldEqual false
      dao.isPostExists(10) shouldEqual false

      def checkSecondPost(post: Post) = {
        post should have(
          'id (2),
          'header ("header2"),
          'content ("content2")
        )
      }

      val posts = dao.loadPosts()
      posts should have length 2
      posts.head should have(
        'id (1),
        'header ("header1"),
        'content ("content1")
      )
      checkSecondPost(posts(1))

      def checkSecondComments(comments: List[Comment]) = {
        comments should have length 1
        comments.head should have(
          'id (1),
          'postId (2),
          'author ("jack"),
          'email ("jack@gmail.com"),
          'text ("test")
        )
      }
      /** Insert comment */
      dao.addComment(2, "jack", "jack@gmail.com", "test")
      checkSecondComments(dao.loadComments(2))

      val (post, comments) = dao.loadPost(2)
      checkSecondPost(post)
      checkSecondComments(comments)

      /** Update post */
      dao.updatePost(2, "new header", "new content")
      val (updatedPost, _) = dao.loadPost(2)
      updatedPost should have(
        'id (2),
        'header ("new header"),
        'content ("new content")
      )
    }
  }
}
