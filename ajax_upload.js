/**
 * simple ajax upload jQuery plugin
 *
 * @Author Hayk Sarukhanyan
 *
 */

;
(function (jQuery, window, document) {
    /**
     * registering plugin
     */
    jQuery.fn.extend({
        /**
         * plugin init
         * @Function done
         * @Function error
         */
        simpleUpload: function (done,error) {
            //setting success and error functions
            if(typeof done === "function"){
                simpleAjax.options.success = done;
            }
            if(typeof error === "function"){
                simpleAjax.options.error = error;
            }
            if ($(this).is('form')) {
                // adding file attributes to form elements
                for (var i = 0, length = $(this).length; i < length; i++) {
                    simpleAjax.forms['form' + i] = $(this);
                    simpleAjax.files['form' + i] = {};
                    $(this).attr('sform', 'form' + i);
                }
                simpleAjax.forms = $(this);
                simpleAjax.attachEvents($(this));
            }
        }
    });

    simpleAjax = {
        forms: {},
        files: {},
        options: {
            success: function (data, textStatus, jqXHR) {
            },
            error: function (jqXHR, textStatus, errorThrown) {
            }
        },
        /**
         * attaching events to selected form items
         * @param elem
         */
        attachEvents: function (elem) {
            // Add events
            $(elem.find('input[type=file]')).on('change', simpleAjax.prepareUpload);
            $(elem).on('submit', simpleAjax.uploadFiles);
        },
        /**
         * Grab the files and set them to form files attribute
         * @param event
         * @param form
         */
        prepareUpload: function (event) {
            $key = $(event.target.form).attr('sform');
            simpleAjax.files[$key] = event.target.files;
        },

        /**
         * Catching form submit and uploading files
         * @param event
         */
        uploadFiles: function (event) {
            event.stopPropagation();
            event.preventDefault();

            $form = $(event.target);
            $url = $form.attr('action');
            $key = $form.attr('sform');

            // Creating form data object and adding files
            var data = new FormData();

            $.each(simpleAjax.files[$key], function (key, value) {
                data.append(key, value);
            });
            simpleAjax.submitForm(event, data);
            $.ajax({
                url: $url,
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                        // Success so call function to process the form
                        simpleAjax.submitForm(event, data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            });
        },
        /**
         * Form submit function
         * @param event
         * @param data
         */
        submitForm: function (event, data) {
            // Create a jQuery object from the form
            $form = $(event.target);
            $url = $form.attr('action');
            // Serialize the form data
            var formData = $form.serialize();

            $.ajax({
                url: $url,
                type: 'POST',
                data: formData,
                cache: false,
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    simpleAjax.options.success(data, textStatus, jqXHR);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    simpleAjax.options.error(jqXHR, textStatus, errorThrown);
                },
                complete: function () {
                }
            });
        }
    };
})(jQuery, window, document);
