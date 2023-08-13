/*
    Coladder all rights reserved
    Version: 1.0
    Copyright 2023
    author Omar El Kheir
    email: omarkheir.dev@gmail.com
*/

//PLEASE NOTE THAT COLADDER IS STILL IN EARLY ALPHA

$(document).ready(function () {

    //defining field element
    var ca_field = $(".ca_field");

    //what the remove button contains inside of it:
    var cat_remove_inner = "remove"; //default is remove

    //a function to set the inner text of the remove button:
    function caf_set_remove_inner(element) {
        cat_remove_inner = element;
    }

    //this variable is to keep track of the number of elements added to the field and their ordering
    var ca_number_of_elements = 0;
    //this array is required to keep track of existing elements number
    var ca_elements_array = [];

    //this will return the currently selected element based on the number_of_elements variable
    var ca_last_focused = 0;


    //======================================================================//
    //this section will be focused on the text element

    //defining the add tool button
    var cat_text = $("#cat_text");

    //granting it the function that adds a text block to the field
    $(cat_text).click(function (e) {
        e.preventDefault(); //optional - to prevent any unnecessary problems
        $(ca_field).append(
            '<div class="cas_container" id="cas_container_' + ca_number_of_elements + '">' + //we need a parent div so we could issue a delete function later 
            '<div class="cas_text" id="ca_text_' + ca_number_of_elements + '"' + /*each element has a unique id*/
            ' contentEditable="true">Type here</div>' +
            '<div class="cat_move_buttons"><button class="ca_move_up">Up</button> <button class="ca_move_down">Down</button></div>' +
            '<div class="cat_remove_container"><button id="cat_remove">' + cat_remove_inner + '</button></div>' +
            '</div>'
        )

        ca_elements_array.push(ca_number_of_elements); //add the element to the array
        ca_number_of_elements++; //increase it by 1 each time an element is added
    })




    //remove button function:
    $(ca_field).on("click", "#cat_remove", function (e) {
        e.preventDefault();
        $(this).closest(".cas_container").remove();

        //here we remove its id from the array
        let ca_container_id = $(this).closest('.cas_container').attr('id');
        let ca_current_index = parseInt(ca_container_id.substring(14));

        //remove the element from the array
        for (let index = 0; index < ca_elements_array.length; index++) {
            if (ca_elements_array[index] == ca_current_index) {
                ca_elements_array.splice(index, 1);
            }
        }

    })



    //======================================================================//
    //text coloring tool:

    //defining the color input
    var cat_color = document.getElementById('cat_color_picker');

    //we must create 2 events handlers: one for changing the color of the selected text and another to change color of the next written text 

    //event handler when text is not selected:
    function caf_event_not_selected(e) {
        //adding the &nbsp element is annoying yet important and inevitable, since creating an empty span will not allow the user to edit it
        let ca_span = '<span style="color: ' + e.target.value + '" contentEditable="true">&nbsp</span>';
        $("#" + ca_last_focused).append(ca_span); //add a span to the currently/last focued paragraph

    }


    //event handler for when text is selected:
    function caf_event_selected(e) {
        let ca_selection = window.getSelection(); //checks if text is selected
        if (ca_selection.rangeCount > 0) {
            let ca_range = ca_selection.getRangeAt(0);
            let ca_selectedText = ca_range.toString(); //make it a string
            let ca_added_span = document.createElement('span'); // make a span
            ca_added_span.style.color = e.target.value; //set it's color to the desired one
            ca_added_span.appendChild(document.createTextNode(ca_selectedText));
            ca_range.deleteContents();
            ca_range.insertNode(ca_added_span); //deletes old text and replaces it with the same content but with a span that has a color
        }
    }


    //function to add/remove event handlers based on focus/blur so that they don't stay active and cause bugs
    function caf_run_events_focused() {
        cat_color.removeEventListener('input', caf_event_selected);
        cat_color.addEventListener('change', caf_event_not_selected);
    }

    function caf_run_events_not_focused() {
        cat_color.removeEventListener('change', caf_event_not_selected);
        cat_color.addEventListener('input', caf_event_selected);
    }



    //a loop that keeps checking if any text container was or was not selected every 0.5 seconds and applies event handlers as fits
    //the goal of this check is so that it doesn't spam empty spans in the text field, since the 'input' event loops.
    function caf_loop() {
        let ca_paragraph = $(".cas_text");

        $(ca_paragraph).on('focus', function () {
            ca_last_focused = $(this).attr('id');
            caf_run_events_focused();
        })

        $(ca_paragraph).on('blur', function () {
            caf_run_events_not_focused();
        })
    }

    //looping the function:
    setInterval(caf_loop, 500);



    //======================================================================//
    //reordering elements function

    function caf_move_element(element, direction) { //direction: "up" or "down" this applies horizontally too where "up" moves elements to the right and vice versa
        let ca_next_div_id;
        let ca_next_div;

        if (direction == "down") {
            ca_next_div_id = $(element).closest('.cas_container').next().attr('id');

        } else if (direction == "up") {
            ca_next_div_id = $(element).closest('.cas_container').prev().attr('id');
        } else {
            console.log("Coladder: ERR_INVALID_DIRECTION - invalid function parameters");
        }

        //fetching the elements
        ca_next_div = $("#" + ca_next_div_id);
        let ca_current_div = $(element).closest('.cas_container');
        let ca_current_div_id = $(ca_current_div).attr('id');

        ca_next_div_html = $(ca_next_div).html();
        ca_current_div_html = $(ca_current_div).html();

        //defining an animation movement span
        let ca_current_height;
        let ca_next_height;

        //get the gap from the display flex if theres any in the .ca_field
        let ca_flex_gap = $(ca_field).css('gap');
        ca_flex_gap = parseInt(ca_flex_gap.replace("px", ""));

        //indicates direction of animation based on all the factors
        if (direction == "down") {
            ca_current_height = (($("#" + ca_current_div_id).height()) + ca_flex_gap);
            ca_next_height = (($("#" + ca_next_div_id).height() + ca_flex_gap) * -1);
        } else if (direction == "up") {
            ca_current_height = (($("#" + ca_next_div_id).height() + ca_flex_gap) * -1);
            ca_next_height = (($("#" + ca_current_div_id).height()) + ca_flex_gap);
        }

        //animation
        $(ca_current_div).animate({ top: ca_current_height }, 500);
        $(ca_next_div).animate({ top: ca_next_height }, 500, function () {
            //waits for animations to finish, resets their positions then switches the elements
            $(ca_next_div).css('top', '0px')
            $(ca_current_div).css('top', '0px')

            $(ca_next_div).attr('id', ca_current_div_id);
            $(ca_current_div).attr('id', ca_next_div_id);

            $(ca_next_div).html(ca_current_div_html);
            $(ca_current_div).html(ca_next_div_html);
        });
    }


    $(ca_field).on("click", ".ca_move_down", function (e) {
        e.preventDefault();
        caf_move_element(this, "down");
    })

    $(ca_field).on("click", ".ca_move_up", function (e) {
        e.preventDefault();
        caf_move_element(this, "up");
    })



    //this function serves as a loop to constantly disable and enable buttons appropriatly 
    function caf_loop_buttoncheck() {
        let ca_first_element = $(ca_field).find(".cas_container:first");
        ca_first_element = $(ca_first_element).attr('id');
        let ca_last_element = $(ca_field).find(".cas_container:last");
        ca_last_element = $(ca_last_element).attr('id');


        let ca_first_button = $("#" + ca_first_element).find(".ca_move_up");
        let ca_last_button = $("#" + ca_last_element).find(".ca_move_down");

        //disable appropriate buttons from first and last element in the ca_field div
        $(ca_first_button).attr('disabled', true);
        $(ca_last_button).attr('disabled', true);

        let ca_mid_elements = $(ca_field).find(".cas_container:not(:first):not(:last)");

        //get elements in between the first and last element
        ca_mid_elements_array = ca_mid_elements.each(function () {
            let array_id = $(this).attr('id');
            $("#" + array_id).find('.ca_move_up').attr('disabled', false);
            $("#" + array_id).find('.ca_move_down').attr('disabled', false);

        })

        //these conditions are to prevent bugs previously encountered
        if (ca_elements_array.length === 1) {
            let ca_enabler = $("#" + ca_first_element).find(".ca_move_down");
            $(ca_enabler).attr('disabled', true);
            $(ca_first_button).attr('disabled', true);
        } else if (ca_elements_array.length === 2) {
            let ca_enabler = $("#" + ca_first_element).find(".ca_move_down");
            let ca_enabler_2 = $("#" + ca_last_element).find(".ca_move_up");

            $(ca_enabler).attr('disabled', false);
            $(ca_enabler_2).attr('disabled', false);
        }
        else {
            let ca_enabler = $("#" + ca_first_element).find(".ca_move_down");
            $(ca_enabler).attr('disabled', false);
        }
    }

    setInterval(caf_loop_buttoncheck, 1); //looping the function


})
