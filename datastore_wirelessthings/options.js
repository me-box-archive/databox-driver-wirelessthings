{
   "OPTIONS /":{
      "description":"Api Endpoint descriptions for enrivronmental sensor datastore, all endpoints require a token parameter",
      "endpoints":[
         {
            "GET /nodes":{
               "desciption":"lists all nodes available within the data store, probably used by discovery service to get available sensor list",
               "example_response":{
                  "available_nodes":[
                     {
                        "id":"AA",
                        "manufacturer":"CISECO",
                        "decsription":"Living room multisensor",
                        "streams":[
                           {
                              "name":"temperature",
                              "unit":"degrees ceclcius",
                              "short_unit":"ºC"
                           },
                           {
                              "name":"relative_humidity",
                              "unit":"percentage relative humidity",
                              "short_unit":"%"
                           }
                        ]
                     },
                     {
                        "id":"AB",
                        "manufacturer":"CISECO",
                        "decsription":"Bathroom multisensor",
                        "streams":[
                           {
                              "name":"temperature",
                              "unit":"degrees ceclcius",
                              "short_unit":"ºC"
                           },
                           {
                              "description":"relative_humidity",
                              "unit":"percentage relative humidity",
                              "short_unit":"%"
                           },
                           {
                              "description":"carbon_dioxide",
                              "unit":"parts per million",
                              "short_unit":"ppm"
                           }
                        ]
                     }
                  ]
               }
            }
         },
         {
            "GET /resolutions":{
               "description":"lists the potential resolutions that can be specified when making a request to a node",
               "example_response":[
                  {
                     "description":"aggregated over 5 minute intervals",
                     "aggregation":"average",
                     "unit":"minutes",
                     "interval":5
                  },
                  {
                     "description":"aggregated over 30 minute intervals",
                     "aggregation":"average",
                     "unit":"minutes",
                     "interval":30
                  }
               ]
            }
         },
         {
            "GET /data":{
               "description":"alllows retreival of historical readings for a paritular stream of data",
               "required_parameters":[
                  {
                     "name":"node_id",
                     "type":"string",
                     "description":"node_id specified in SLA",
                     "example":"XX"
                  },
                  {
                     "name":"stream_code",
                     "type":"string",
                     "description":"stream_code for node_id specified in SLA",
                     "example":"TEMP"
                  },
                  {
                     "name":"start_timestamp",
                     "type":"epoch integer",
                     "description":"start timestamp for historical returned data",
                     "example":"2012-04-23T18:25:43.511Z"
                  },
                  {
                     "name":"end_timestamp",
                     "type":"epoch integer",
                     "description":"end timestamp for historical returned data ",
                     "example":"2012-04-23T18:25:43.511Z"
                  },
                  {
                     "name":"resolution",
                     "type":"json object containing unit of time and interval required",
                     "description":"can only use values specified in SLA and can only use values described in /resolutions",
                     "example":{
                        "unit":"minute",
                        "interval":5
                     }
                  }
               ],
               "example_response":{
                  "node_id":"XX",
                  "stream_code":"TEMP",
                  "start_timestamp":"2012-04-23T18:25:00.000Z",
                  "end_timestamp":"2012-04-23T19:05:00.000Z",
                  "resoltion":{
                     "unit":"minute",
                     "interval":5
                  },
                  "data":{
                     "2012-04-23T18:25:00.000Z":22.0,
                     "2012-04-23T18:30:00.000Z":23.4,
                     "2012-04-23T18:35:00.000Z":21.0,
                     "2012-04-23T18:40:00.000Z":23.0,
                     "2012-04-23T18:45:00.000Z":23.3,
                     "2012-04-23T18:50:00.000Z":21.0,
                     "2012-04-23T18:55:00.000Z":21.0,
                     "2012-04-23T19:00:00.000Z":22.0,
                     "2012-04-23T19:05:00.000Z":22.0
                  }
               }
            }
         }
      ]
   }
}