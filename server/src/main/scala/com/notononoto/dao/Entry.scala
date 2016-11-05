package com.notononoto.dao

import java.time.LocalDateTime

/** Information about post */
final case class Post(id: Long,
                      timestamp: LocalDateTime,
                      header: String,
                      content: String)

/** Information about comments to post */
final case class Comment(id: Long,
                         postId: Long,
                         /** sequence number of comment in post */
                         number: Long,
                         timestamp: LocalDateTime,
                         author: String,
                         email: String,
                         text: String)
