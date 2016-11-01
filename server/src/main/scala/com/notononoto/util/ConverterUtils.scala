package com.notononoto.util

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
  * Util class for frequent conversions
  *
  * @author dancing-elf
  *         11/1/16.
  */
object ConverterUtils {

  /** Application datetime format */
  private val format = DateTimeFormatter.ofPattern("HH-mm-ss dd-MM-yyyy")

  /**
    * @param dateTime local datetime
    * @return datetime in application's format
    */
  def dateToString(dateTime: LocalDateTime): String = {
    format.format(dateTime)
  }

  /**
    * @param str datetime in application's format
    * @return local datetime
    */
  def stringToDate(str: String): LocalDateTime = {
    LocalDateTime.parse(str, format)
  }
}
