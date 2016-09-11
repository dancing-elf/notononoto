package com.notononoto

import akka.http.scaladsl.model.ContentTypes.`application/json`
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.model.headers.`Content-Type`
import akka.http.scaladsl.testkit.ScalatestRouteTest
import org.junit.runner.RunWith
import org.scalatest._
import org.scalatest.junit.JUnitRunner

@RunWith(classOf[JUnitRunner])
class RouteTest extends WordSpec with Matchers with ScalatestRouteTest {

  val route = RouteFactory.createRoute("")

  "The server" should {
    "correctly handle posts list request" in {
      Get("/api/posts") ~> route ~> check {
        status shouldEqual StatusCodes.OK
        header[`Content-Type`] shouldEqual Some(`Content-Type`(`application/json`))
      }
    }
    "correctly handle post request" in {
      Get("/api/post/2") ~> route ~> check {
        status shouldEqual StatusCodes.OK
        header[`Content-Type`] shouldEqual Some(`Content-Type`(`application/json`))
      }
    }
    "reject not existed post id" in {
      Get("/api/post/300") ~> route ~> check {
        handled shouldBe false
      }
    }
  }
}