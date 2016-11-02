package com.notononoto.dao

import java.time.LocalDateTime

import com.notononoto.util.{ConverterUtils, NotononotoException}
import com.orientechnologies.orient.core.db.document.ODatabaseDocumentTx
import com.orientechnologies.orient.core.metadata.sequence.OSequence
import com.orientechnologies.orient.core.metadata.sequence.OSequence.SEQUENCE_TYPE
import com.orientechnologies.orient.core.record.impl.ODocument
import com.orientechnologies.orient.core.sql.query.OSQLSynchQuery
import resource._

import scala.collection.JavaConversions._


/** Working with database */
class NotononotoDao(db: ODatabaseDocumentTx) {

  /**
    * @return list of posts
    */
  def loadPosts(): List[Post] = {
    query(db, "select * from Post").map(docToPost)
  }

  /**
    * @param id identifier of post
    * @return post data and list of it's comments
    */
  def loadPost(id: Long): (Post, List[Comment]) = {
    val post = docToPost(findPostDoc(id))
    val comments = query(db, "select * from Comment where post_id=?", id).
      map(docToComment)
    (post, comments)
  }

  /**
    * @return true if post exists in database
    */
  def isPostExists(id: Long): Boolean = {
    val count: Long =
      getOne(query(db, "select count(*) from Post where id=?", id)).
        field("count")
    count == 1
  }

  /**
    * Add new comment
    * @param postId post's identifier
    * @param author author of comment
    * @param email email
    * @param text content of comment
    */
  def addComment(postId: Long,
                 author: String,
                 email: String,
                 text: String): Unit = {
    val comment = Comment(nextSeq(db, "comment_seq"), postId,
      LocalDateTime.now(), author, email, text)
    commentToDoc(comment).save()
  }

  /**
    * @param postId identifier of post
    * @return list of comments for post
    */
  def loadComments(postId: Long): List[Comment] = {
    query(db, "select * from Comment where post_id=?", postId).map(docToComment)
  }

  /**
    * Add new post
    * @param header title of post
    * @param content content of post
    */
  def createPost(header: String, content: String): Unit = {
    val post = Post(nextSeq(db, "post_seq"), LocalDateTime.now(), header, content)
    postToDoc(post).save()
  }

  /**
    * Update post
    * @param id post id
    * @param header title of post
    * @param content content of post
    */
  def updatePost(id: Long, header: String, content: String): Unit = {
    val doc = findPostDoc(id)
    doc.field("header", header)
    doc.field("content", content)
    doc.save()
  }

  /** Close database */
  def close() = {
    db.close()
  }

  private def findPostDoc(id: Long): ODocument = {
    getOne(query(db, "select * from Post where id=?", id))
  }

  private def docToPost(doc: ODocument): Post = {
    Post(
      doc.field("id"),
      ConverterUtils.stringToDate(doc.field("timestamp")),
      doc.field("header"),
      doc.field("content"))
  }

  private def postToDoc(post: Post): ODocument = {
    new ODocument("Post").
      field("id", post.id).
      field("timestamp", ConverterUtils.dateToString(post.timestamp)).
      field("header", post.header).
      field("content", post.content)
  }

  private def docToComment(doc: ODocument): Comment = {
    Comment(
      doc.field("id"),
      doc.field("post_id"),
      ConverterUtils.stringToDate(doc.field("timestamp")),
      doc.field("author"),
      doc.field("email"),
      doc.field("text")
    )
  }

  private def commentToDoc(comment: Comment): ODocument = {
    new ODocument("Comment").
      field("id", comment.id).
      field("post_id", comment.postId).
      field("timestamp", ConverterUtils.dateToString(comment.timestamp)).
      field("author", comment.author).
      field("email", comment.email).
      field("text", comment.text)
  }

  private def query(db: ODatabaseDocumentTx,
                    queryStr: String, args: AnyVal*): List[ODocument] = {
    val res: java.util.List[ODocument] =
      db.query(new OSQLSynchQuery[ODocument](queryStr),
               args.map(_.asInstanceOf[AnyRef]):_*)
    res.toList
  }

  private def nextSeq(db: ODatabaseDocumentTx, seqName: String): Long = {
    db.getMetadata.getSequenceLibrary.getSequence(seqName).next()
  }

  private def getOne(list: List[ODocument]): ODocument = {
    if (list.isEmpty) {
      throw new NotononotoException("No element found")
    }
    if (list.size > 1) {
      throw new NotononotoException("Too many elements in list")
    }
    list.head
  }
}

/** Class for managing dao creation */
class NotononotoDaoCreator(url: String) {

  /**
    * @return [[NotononotoDao]]
    */
  def create(): NotononotoDao = {
    // We are using local database so we can not worry about
    // security of database. If malefactor has access to our
    // file system all is very very bad in any case, otherwise
    // the database will be safe
    val db: ODatabaseDocumentTx =
        new ODatabaseDocumentTx(url).open("admin", "admin")
    new NotononotoDao(db)
  }
}

/** Object for managing database initialization */
object NotononotoDaoCreator {

  /**
    * Initialize orientdb
    * @param root path to server folder
    */
  def apply(root: String): NotononotoDaoCreator = {
    val url = "plocal:" + root + "/notononoto.orient"
    val db = new ODatabaseDocumentTx(url)
    if (!db.exists()) {
      db.create()
      managed(db) acquireAndGet { resource =>
        // Create database's sequences and schemas
        val lib = resource.getMetadata.getSequenceLibrary
        lib.createSequence("post_seq",
          SEQUENCE_TYPE.ORDERED, new OSequence.CreateParams().setStart(0L))
        lib.createSequence("comment_seq",
          SEQUENCE_TYPE.ORDERED, new OSequence.CreateParams().setStart(0L))
        resource.getMetadata.getSchema.createClass("Post")
        resource.getMetadata.getSchema.createClass("Comment")
      }
    }
    new NotononotoDaoCreator(url)
  }
}