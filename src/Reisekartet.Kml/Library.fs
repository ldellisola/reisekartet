module Reisekartet.Kml
open System.IO
open FSharp.Data
open System.Collections.Generic


type KlmPlace = { Name: string; Latitude: double; Longitude: double }

type Klm22Parser = XmlProvider<Schema="https://code.google.com/apis/kml/schema/kml22gx.xsd">

let ParseKlm  (stream: Stream) =
    let xml = Klm22Parser.Load(stream)
    let dictionary = Dictionary<string, List<KlmPlace>>()

    for folder in xml.Kml.Value.Document.Value.Folders do
        let categoryName = folder.Name.Value
        let places = List<KlmPlace>()

        for placeMark in folder.Placemarks do
            let placeName = placeMark.Name.Value
            let coordinates = placeMark.Point.Value.Coordinates.Value.Split(',')
            places.Add { Name = placeName; Latitude = double coordinates[1]; Longitude = double coordinates[0] }

        dictionary[categoryName] <- places

    dictionary
