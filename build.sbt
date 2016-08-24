name := "notononoto"

version := "1.0"

val akkaVersion = "2.4.9"

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-http-core" % akkaVersion,
  "com.typesafe.akka" %% "akka-http-experimental" % akkaVersion,
  "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaVersion,
  "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaVersion
)

scalaVersion := "2.11.8"

