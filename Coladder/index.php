<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .ca_field {
            position: relative;
            width: 450px;
            min-height: 50px;
            height: max-content;
            display: flex;
            flex-direction: column;
            gap: 40px;
            background: #445069;
            margin-bottom: 20px;

        }

        .cas_container {
            position: relative;
        }
    </style>
    <title>Document</title>
</head>

<body>
    <h3>Coladder - version 1.0</h3>
    <h5>Omar El Kheir</h5>
    <h6 style="color:indianred">NOTE: COLADDER IS STILL IN EARLY ALPHA</h6>

    <!-- To get started, create a .ca_field div here-->
    <div class="ca_field"></div>

    <!-- After the .ca_field div create a color input like so: -->
    <input name="cat_color_picker" type="color" id="cat_color_picker" />

    <!-- You will also need the tool buttons: -->
    <button id="cat_text">Add a text box</button>


    <?php

    //the div where you want to add your content class must be called "ca_field" and it should be placed inside a form tag
    //the submit button should have the id of "cat_submit"
    //any added elements use a "ca_" prefix
    //current available elements: ca_text, ca_image, ca_link.
    //Coladder tools use the "cat_" prefix
    //current available tools are: [cat_text, cat_image, cat_link] as buttons and [cat_submit] as an input type="submit".
    //and id = "cat_color" as an input type = "color" or "text" that takes color as input 
    //for styling purposes, any appended element by Coladder has a "cas_" class prefix. e.g: cas_text
    //the remove element button has the id of "cat_remove"

    ?>

    <script src="https://code.jquery.com/jquery-3.6.3.min.js"></script>
    <script type="text/javascript" src="coladder.js"></script>

</body>

</html>