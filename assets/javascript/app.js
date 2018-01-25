$(document).ready(function () {

    // added map framework to top of doc for visibility. - Dave 

    var map = L.map("mapid").setView([34.0522, -118.2437], 10);

    L.tileLayer('https://api.mapbox.com/styles/v1/davefunk135/cjcmojod01ok82sp66qqkxu3y/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGF2ZWZ1bmsxMzUiLCJhIjoiY2pjbW9pd2N6MHk3OTMzcGZuMWl4aTlsOSJ9.rActLhTE7DbMxrIzPENhbA', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);
    // Map ends Here. Adding function passLocation into where location is called.

    var APIforEvan = "BgwAiMT";

    var APIforCR = "cfbcda2ca9b6fa70bc7d1f0bf8a117d078fbdc81";

    var allFlavors = [];
    var allEffects = [];
    var dispensaries = [];
    var dispensaryLatLongs = [];

    function renderFlavorButtons() {
        $("#all-flavor-buttons").empty();

        allFlavors.sort();
        for (var i = 0; i < allFlavors.length; i++) {
            var tempButton = $("<button>");
            tempButton.addClass("flavor-list-item btn btn-success btn-sm " + allFlavors[i]);
            tempButton.attr("data-name", allFlavors[i]);
            tempButton.text(allFlavors[i]);
            $("#all-flavor-buttons").append(tempButton);
        }
        allFlavors = [];
    }

    function renderEffectsButtons() {
        $("#all-effects-buttons").empty();

        allEffects.sort();
        for (var i = 0; i < allEffects.length; i++) {
            var tempButton = $("<button>");
            tempButton.addClass("effect-list-item btn btn-success btn-sm " + allEffects[i]);
            tempButton.attr("data-name", allEffects[i]);
            tempButton.text(allEffects[i]);
            $("#all-effects-buttons").append(tempButton);
        }
        allEffects = [];
    }

    //Hitting All Flavors button
    var hasClickedAllFlavors = false;

    $("#flavor-button").on("click", function (event) {
        event.preventDefault();


        // console.log("all flavors pressed");
        if (hasClickedAllFlavors) {
            $(".flavor-list-item").toggle();

        } else {
            var queryURL = "http://strainapi.evanbusse.com/" + APIforEvan + "/searchdata/flavors";
            $.ajax({
                dataType: "json",
                url: queryURL,
                method: "GET"
            }).done(function (response) {
                // console.log(response);

                for (var i = 0; i < response.length; i++) {
                    allFlavors.push(response[i]);
                }

                renderFlavorButtons();
            })
                .fail(function (xhr, status, error) {
                    // console.log(error);
                });
            hasClickedAllFlavors = true;
        }


    });

    var pickedFlavor = false;

    //Picking flavor button
    $(document).on("click", ".flavor-list-item", function () {
        $("#flavor-recs-div").empty();
        pickedFlavor = true;

        // console.log("you have picked an flavor.");
        var flavor = $(this).attr("data-name");
        // console.log(flavor);

        var queryURL = "http://strainapi.evanbusse.com/" + APIforEvan + "/strains/search/flavor/" + flavor;
        $.ajax({
            dataType: "json",
            url: queryURL,
            method: "GET",
        }).done(function (response) {
            // console.log(pickedEffect)
            // if (pickedEffect) {
            //     //check to see if strains from flavor match strain from effect and only show if they have both.
            //     for (var i = 0; i < response.length; i++) {

            //         if ($(".choice").hasClass(response[i].name)) {
                        // console.log(response[i].name);
            //             console.log("Has both flavor and effect");
            //             var name = response[i].name;
            //             $("." + response[i].name).removeClass("preference");
            //             $("." + response[i].name).addClass("special");

            //         }
            //     }

            //     $(".preference").toggle();
            // } else {
                $("#flavor-recs-div").empty();

                for (var i = 0; i < response.length; i++) {
                    var name = response[i].name;
                    var tempButton = $("<button>");
                    tempButton.addClass("choice btn btn-success btn-sm preference " + name);
                    tempButton.attr("data-name", name);
                    tempButton.text(name);
                    $("#flavor-recs-div").append(tempButton);
                }
            // }

        })

    });

    //Location Stuff
    var myLat;
    var myLong;


    $(document).on("click", "#locate-btn", function () {
        // console.log("I pressed the locator");
        getLocation();

        var x = document.getElementById("locator");

        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, geoError);

            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        function showPosition(position) {
            // x.innerHTML = "Latitude: " + position.coords.latitude + 
            // "<br>Longitude: " + position.coords.longitude;

            myLat = position.coords.latitude;
            myLong = position.coords.longitude;
            // console.log(myLat);
            // console.log(myLong);
            var locQuery = "https://www.cannabisreports.com/api/v1.0/strains/" + myUCPC + "/availability/geo/" + myLat + "/" + myLong + "/25";
            // console.log(locQuery);
            $.ajax({
                dataType: "jsonp",
                url: locQuery,
                method: "GET",
            }).done(function (response) {

                // console.log(response);

                for (var i = 0; i < response.data.length; i++) {
                    dispensaries.push({
                        name: response.data[i].location.name,
                        lat: response.data[i].location.lat,
                        lng: response.data[i].location.lng
                    });
                    function passLocation() {
                        L.marker([response.data[i].location.lat, response.data[i].location.lng]).bindPopup('<a href="https://www.google.com/search?q=' + response.data[i].location.name + '">' + response.data[i].location.name).addTo(map);
                    }
                    passLocation();
                }


            })
                .fail(function (xhr, status, err) {
                    // console.log(err);
                });
        }

        function geoError() {
            // console.log("Not Allowed");
        }

        // var locQuery = "https://www.cannabisreports.com/api/v1.0/strains/" + myUCPC + "/availability/geo/" + myLat + "/" + myLong + "/10";



    });


    //Flavor Input Field
    $(".flavor-submit").on("click", function (event) {
        event.preventDefault();

        // console.log("flavor pressed");
        var flavor = $(".flavor-input").val().trim();
        var queryURL = "http://strainapi.evanbusse.com/" + APIforEvan + "/strains/search/flavor/" + flavor;
        $.ajax({
            dataType: "json",
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            // console.log(response);
        })
            .fail(function (xhr, status, error) {
                // console.log(error);
            });

    });

    // For strain input field================================================================================
    $("#strain-submit").on("click", function (event) {
        event.preventDefault();

        // console.log("strain pressed");
        var strain = $("#strain-input").val().trim();
        // var pageNumber = 1;
        // var queryURL = "http://api.otreeba.com/v1/strains?page="+ pageNumber + "&count=50&sort=name";

        var queryURL0 = "http://strainapi.evanbusse.com/" + APIforEvan + "/strains/search/name/" + strain;

        var queryURL1 = "https://www.cannabisreports.com/api/v1.0/strains/search/" + strain;

        //     $.getJSON("http://www.cannabisreports.com/api/v1.0/strains/VUJCJ4TYMG000000000000000", function(data) { 
            // console.log(data);
        // });

        //searches evanbuss api
        $.ajax({
            dataType: "json",
            url: queryURL0,
            method: "GET"
        }).done(function runData(response) {

            // console.log(response);

            var topResults = $("#strain-search-buttons").html("<br><h3>Top Search Results:</h3><br>");
            topResults;
            for (var i = 0; i < response.length; i++) {
                var name = response[i].name;
                var tempButton = $("<button>");
                tempButton.addClass("choice btn btn-success btn-sm preference eb " + name);
                tempButton.attr("data-name", name);
                tempButton.text(name);
                // $(".testcontent").append(tempButton);
            }

        })
            .fail(function (xhr, status, error) {
                // console.log(error);
            });

        //searches CR API
        $.ajax({
            dataType: "jsonp",
            url: queryURL1,
            method: "GET",
        }).done(function runData(response) {

            // console.log(response);

            for (var i = 0; i < response.data.length; i++) {
                var name = response.data[i].name;
                var tempButton = $("<button>");
                tempButton.addClass("choice btn btn-success btn-sm preference cr " + name);
                tempButton.attr("data-name", name);
                tempButton.text(name);
                $("#strain-search-buttons").append(tempButton);
            }

            //if there is another page of results.
            // if (response.meta.pagination.links.next) {
                // console.log("There is another page");
            //     var tempButton = $("<button>");
            //     tempButton.addClass("next btn btn-success btn-sm ");
            //     tempButton.attr("data-link", response.meta.pagination.links.next);
            //     tempButton.text("Next Page");
            //     $("#strain-search-buttons").html(tempButton);

            // }

            // if(response.meta.pagination.links.previous){
            //     console.log("There is previous page");
            //     var tempButton = $("<button>");
            //     tempButton.addClass("previous btn btn-success btn-sm ");
            //     tempButton.attr("data-link",response.meta.pagination.links.previous);
            //     tempButton.text("Previous Page");
            //     $(".testcontent").append(tempButton);

            // }

            var pageNumber = 2;
            $(document).on("click", ".next", function () {
                $(".choice").remove();

                var nextURL = "https://www.cannabisreports.com/api/v1.0/strains/search/" + strain + "?q=" + strain + "&page=" + pageNumber;
                // console.log(nextURL);

                $.ajax({
                    dataType: "jsonp",
                    url: nextURL,
                    method: "GET",
                }).done(function (response) {
                    // console.log(response);

                    for (var i = 0; i < response.data.length; i++) {
                        var name = response.data[i].name;
                        var tempButton = $("<button>");
                        tempButton.addClass("choice btn btn-success btn-sm preference cr " + name);
                        tempButton.attr("data-name", name);
                        tempButton.text(name);
                        $("#strain-search-content").prepend(tempButton);
                    }
                    // $(".testcontent").prepend(response);
                    // console.log("Next button works");
                })
                pageNumber++;

                if (response.meta.pagination.links.previous) {
                    // console.log("There is previous page");
                    var tempButton = $("<button>");
                    tempButton.addClass("previous btn btn-success btn-sm preference ");
                    tempButton.attr("data-link", response.meta.pagination.links.previous);
                    tempButton.text("Previous Page");
                    $(".testcontent").append(tempButton);

                }

            });

            $(document).on("click", ".previous", function () {

                var previousURL = "https://www.cannabisreports.com/api/v1.0/strains/search/" + strain + "?q=" + strain + "&page=" + pageNumber;
                // console.log(previousURL);

                $.ajax({
                    dataType: "jsonp",
                    url: previousURL,
                    method: "GET",
                }).done(function (response) {
                    // console.log(response);
                    $(".testcontent").prepend(response);
                    // console.log("previous button works");
                })
                pageNumber--;
            });

        })
            .fail(function (xhr, status, error) {
                // console.log(error);
            });


    });

    //============================================================================================


    //All effects button
    var hasClickedAllEffects = false;
    $("#all-effects-button").on("click", function (event) {
        event.preventDefault();

        // console.log("all effects pressed");

        // if (hasClickedAllEffects) {
        $(".effect-list-item").toggle();
        // } else {

        var queryURL = "http://strainapi.evanbusse.com/" + APIforEvan + "/searchdata/effects";
        $.ajax({
            dataType: "json",
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            // console.log(response);

            for (var i = 0; i < response.length; i++) {
                allEffects.push(response[i].effect);
            }

            renderEffectsButtons();
        })
            .fail(function (xhr, status, error) {
                // console.log(error);
            });

        //     hasClickedAllEffects = true;
        // }


    });

    var pickedEffect = false;

    //Picking effect button
    $(document).on("click", ".effect-list-item", function () {
        // console.log("you have picked an effect.");
        pickedEffect = true;
        //    $(noMatch).remove();
        //    $(topResults).remove();
        var effect = $(this).attr("data-name");
        // console.log(effect);

        var queryURL = "http://strainapi.evanbusse.com/" + APIforEvan + "/strains/search/effect/" + effect;
        $.ajax({
            dataType: "json",
            url: queryURL,
            method: "GET",
        }).done(function (response) {
            // console.log(response);


            // if (pickedFlavor) {
                //check to see if strains from flavor match strain from effect and only show if they have both.
                for (var i = 0; i < response.length; i++) {

                    if ($(".choice").hasClass(response[i].name)) {
                        // console.log(response[i].name);
                        // console.log("Has both flavor and effect");
                        var name = response[i].name;
                        $("." + name).removeClass("preference");
                        $("." + name).addClass("special");

                    }
                }

            //     $(".preference").toggle();
            // } else {
                $("#effect-strain-returns").empty();

                for (var i = 0; i < response.length; i++) {
                    var name = response[i].name;
                    var tempButton = $("<button>");
                    tempButton.addClass("choice btn btn-success btn-sm preference " + name);
                    tempButton.attr("data-name", name);
                    tempButton.text(name);
                    $("#effect-strain-returns").append(tempButton);
                }
            // }

        })



    });

    //Effect input field
    $(".effect-submit").on("click", function (event) {
        event.preventDefault();

        // console.log("effect pressed");

        var effect = $(".effect-input").val().trim();
        var queryURL = "http://strainapi.evanbusse.com/" + APIforEvan + "/strains/search/effect/" + effect;
        $.ajax({
            dataType: "json",
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            // console.log(response);

        })
            .fail(function (xhr, status, error) {
                // console.log(error);
            });

    });

    var myUCPC = "";

    //Hitting a choice button
    $(document).on("click", ".choice", function () {
        myUCPC = "";
        $(".strain-display").empty();
        var myChoice = $(this).attr("data-name");
        var queryURL = "https://www.cannabisreports.com/api/v1.0/strains/search/" + myChoice;

        // console.log({ "I made a choice": myChoice });
        $.ajax({
            dataType: "jsonp",
            url: queryURL,
            method: "GET",
        }).done(function (response) {

            // console.log(response);
            for (var i = 0; i < response.data.length; i++) {

                // console.log("entered for loop");

                // if (response.data[i].name === myChoice) {
                //     console.log("exact match");
                // var strainDescription = response.data[i].desc;
                // console.log(strainDescription);
                // var strainType = response.data[i].race;
                $("#strain-photo-div").html("<img id='strain-photo' src='" + response.data[i].image + "'>");
                $("#strain-name-div").html("Name: " + response.data[i].name + "<br> Reported Effects (1-10 Scale): <br>");
                // $("#strain-description-div").html(strainDescription)
                var genetics = response.data[i].genetics.names;
                $("#strain-genetics-div").html("<span>Genetics: " + genetics + "</span><br>");

                // var lineage = JSON.stringify(response.data[i].lineage);
                // $("#strain-lineage-div").html("Origins: " + lineage + "<br>");

                myUCPC = response.data[i].ucpc;

                var EFQueryURL = "https://www.cannabisreports.com/api/v1.0/strains/" + myUCPC + "/effectsFlavors";

                $.ajax({
                    dataType: "jsonp",
                    url: EFQueryURL,
                    method: "GET",
                }).done(function (EFresponse) {
                    // console.log(EFresponse);
                    var effectsFlavors = JSON.stringify(EFresponse.data);
                    // console.log(effectsFlavors);
                    $("#flavors-display").append(effectsFlavors);
                    $("#strain-info-div").html("Anxiety: " + parseInt(EFresponse.data.anxiety) + "</br>" + "Appetite Stimulation: " + parseInt(EFresponse.data.appetite_gain) + "</br>" + "Calming: " + parseInt(EFresponse.data.calming) + "</br>" + "Creativity: " + parseInt(EFresponse.data.creativity) + "<br>" + "Dry Mouth: " + parseInt(EFresponse.data.dry_mouth) + "<br>" + "Euphoria: " + parseInt(EFresponse.data.euphoria) + "<br>" + "Numbness: " + parseInt(EFresponse.data.numbness) + "<br>" + "<h4>" + "Flavor and Aroma Profiles: " + "</h4>" + "Fruity: " + parseInt(EFresponse.data.fruity) + "<br>" + "Earthy: " + parseInt(EFresponse.data.earthy) + "<br>" + "Sour: " + parseInt(EFresponse.data.sour) + "<br>" + "Spicy: " + parseInt(EFresponse.data.spicy) + "<br>" + "Sweet: " + parseInt(EFresponse.data.sweet) + "<br>" + "Pine: " + parseInt(EFresponse.data.pine) + "<br>");
                })
                    .fail(function (xhr, status, err) {
                        // console.log(err);
                    })

                //search through for effects/flavors for strain you picked

                // } else { //no exact match, show close matches
                // console.log("no exact match.. show options");
                $("#effect-strain-returns").empty();

                // var noMatch = $("#effect-strain-returns").html("There is no exact match. Did you mean...? <br>");
                // noMatch;
                for (var i = 0; i < response.data.length; i++) {
                    // console.log("entered for loop");
                    var name = response.data[i].name;
                    var tempButton = $("<button>");
                    tempButton.addClass("choice btn btn-success btn-sm preference " + name);
                    tempButton.attr("data-name", name);
                    tempButton.text(name);
                    $("#effect-strain-returns").append(tempButton);
                }



                // }
            }
        });
        $("#strain-locate-button").html("<br><input type ='button' id = 'locate-btn' value ='Locate the strain near you!'>");

    });
    // $(".choice").on("click", function () {
    //     var queryURL0 = "http://strainapi.evanbusse.com/" + APIforEvan + "/strains/search/name/" + strain;

    //     var queryURL1 = "https://www.cannabisreports.com/api/v1.0/strains/search/" + strain;

    //     $.ajax({
    //         dataType: "json",
    //         url: queryURL0,
    //         method: "GET"
    //     }).done(function runData(response) {
    //         var strainDescription = 

    //     })
    //         .fail(function (xhr, status, error) {
    //             console.log(error);
    //         });
    // })
});