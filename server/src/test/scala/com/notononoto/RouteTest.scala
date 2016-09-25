package com.notononoto

import akka.http.scaladsl.model.ContentTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.headers.{BasicHttpCredentials, `Content-Type`}
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.junit.runner.RunWith
import org.scalatest._
import org.scalatest.junit.JUnitRunner

@RunWith(classOf[JUnitRunner])
class RouteTest extends WordSpec with Matchers with ScalatestRouteTest {

  val route = RouteFactory.createRoute("")

  "The server" should {
    "correctly handle posts list request" in {
      Get("/api/public/posts") ~> route ~> check {
        status shouldEqual StatusCodes.OK
        header[`Content-Type`] shouldEqual Some(`Content-Type`(`application/json`))
      }
    }
    "correctly handle post request" in {
      Get("/api/public/post/2") ~> route ~> check {
        status shouldEqual StatusCodes.OK
        header[`Content-Type`] shouldEqual Some(`Content-Type`(`application/json`))
      }
    }
    "reject not existed post id" in {
      Get("/api/public/post/300") ~> route ~> check {
        status shouldEqual StatusCodes.NotFound
      }
    }
    "reject unauthorized" in {
      Get("/api/admin/login") ~> route ~> check {
        status shouldBe StatusCodes.Unauthorized
      }
    }
    "login wrong" in {
      val credentials = BasicHttpCredentials("admin", "wrong")
      Get("/api/admin/login") ~> addCredentials(credentials) ~> route ~> check {
        status shouldBe StatusCodes.Unauthorized
      }
    }
    "login successful" in {
      val credentials = BasicHttpCredentials("admin", "admin")
      Get("/api/admin/login") ~> addCredentials(credentials) ~> route ~> check {
        responseAs[String] shouldEqual "Success"
      }
    }
  }
}