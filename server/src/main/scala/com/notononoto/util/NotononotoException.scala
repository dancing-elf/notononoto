package com.notononoto.util

/**
  * Basic application's exception
  *
  * @author dancing-elf
  *         11/1/16.
  */
class NotononotoException(msg: String, clause: Throwable)
  extends Exception(msg: String, clause: Throwable) {

  def this(msg: String) {
    this(msg, null)
  }
}
