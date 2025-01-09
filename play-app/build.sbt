name := """play-app"""
organization := "com.example"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayJava)

scalaVersion := "2.13.15"

libraryDependencies += guice
libraryDependencies += ws
libraryDependencies += "com.typesafe.play" %% "play-json" % "2.9.2"


libraryDependencies += "org.mongodb" % "mongodb-driver-sync" % "4.9.0"
