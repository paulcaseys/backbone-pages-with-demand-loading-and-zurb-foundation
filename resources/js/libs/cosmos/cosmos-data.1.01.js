
// CONSOLE FIX
// Avoid `console` errors in browsers that lack a console (from html5 boilerplate)
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


// defines the class

if (!window.Cosmos) {
    window.Cosmos = {};
}


if (!window.Cosmos.Data) {
    window.Cosmos.Data = {};
}

if (!window.Cosmos.Project) {
    window.Cosmos.Project = {};
}

if (!window.Cosmos.Config) {
    window.Cosmos.Config = {};
    window.Cosmos.Config.ReferenceDataArray = ['detail_MessageId', 'detail_ImageFile', 'detail_ImageDescription', 'detail_DateReceived', 'detail_Name', 'detail_FirstName', 'detail_LastName', 'detail_HomePhoneNumber', 'detail_EmailAddress', 'detail_Address', 'detail_Address2', 'detail_Suburb', 'detail_Postcode', 'detail_State', 'detail_Country', 'detail_DateOfBirth', 'detail_Gen1', 'detail_Gen2', 'detail_Gen3', 'detail_Gen4', 'detail_Gen5', 'detail_Gen6', 'detail_Gen7', 'detail_Gen8', 'detail_Gen9', 'detail_Gen10', 'page_title', 'page_summary', 'page_body_text', 'page_image_url'];
    window.Cosmos.Config.ServiceUrl = "http://cosmos.is:81/api/service/";
    window.Cosmos.Config.FormModuleUrl = "http://cosmos.is:81/form/module/";
}

$(document).ready(function(){
    
    // custom javascript for this project
    
    //FB.init({ appId: '172209399504725', status: true, cookie: true, xfbml: true });
    
    
    
    //
    //Cosmos.Data.initialiseSomething();
    
    
});

Cosmos.Data.store = (function() {
    this.map = {};

    return {
        set: function ( name, value ) {
            this.map[ name ] = value;
        },
        get: function ( name ) {
            return this.map[ name ];
        }
    };
})();


Cosmos.Data.newForm = function() {

    this._projectName =      "";
    this._projectPassword =  "";
    this._debugMode =        false;

    this._cosmosFormWrapper =        "";

    this._moduleName =  "primary";

    this._editorModule = false;

    /**
     * Defines the project
     * @param   projectName: name for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     * @param   projectPassword: password for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     */
    this.defineProjectSettings = function(projectName, projectPassword, debugMode) {

        debugMode = typeof debugMode !== 'undefined' ? debugMode : false;

        this._projectName =      projectName;
        this._projectPassword =  projectPassword;
        this._debugMode =        debugMode;
    };

    
    this.defineModuleName = function(moduleName) {
        this._moduleName =      moduleName;
    };

    this.defineModuleAsEditor = function(moduleName) {
        this._editorModule = true;
    };
    
    this.setupForm = function(cosmosFormWrapper, varObj) {

        var me = this;

        varObj = typeof varObj !== 'undefined' ? varObj : {};
        
        varObj.success = Cosmos.Data.Traverse(varObj, 'success'); 

        var additionalAttributes = "";
        if(this._editorModule){
            additionalAttributes = "&editor_module=1";
        }

        this._cosmosFormWrapper = cosmosFormWrapper;
        var loadUrl = Cosmos.Config.FormModuleUrl+"?project_name="+this._projectName+"&project_password=" +this._projectPassword+"&module_name="+this._moduleName+'&ver=' + ((new Date()).getTime()) + additionalAttributes;

        //$(this._cosmosFormWrapper).load("http://cosmos.is:81/form/module/?project_name="+this._projectName+"&project_password=" +this._projectPassword+ '&ver=' + ((new Date()).getTime()));
        $.ajax({
            type: "get",
            url: loadUrl,
            crossDomain : true,
            dataType : 'text',
            contentType: 'application/text',
            success: function(html){
                $(me._cosmosFormWrapper).empty().append(html);

                if(varObj.success !== ''){
                    varObj.success(me._cosmosFormWrapper);
                }

            }
        });
    };
};


Cosmos.Data.ImageUploader = function() {

    // variables that are defined in defineProjectSettings();
    this._projectName =         "";
    this._projectPassword =     "";
    this._debugMode =        "";
    this._moduleConfigObject =       "";
    this._imageUploadWrapper =           "";
    this._imageUploadFormWrapper =        "";
    this._varObj = {};


    // an array of ImageUploader objects, when initAllUploadImageForm() is used
    this._imageUploadFormArray =   [];
    this._maximumFilesPerItem = "";

    this._fileUpload = {};
    this._fileUpload.begun = false;
    this._fileUpload.success = false;
    this._fileUpload.uploaded_image_id = "";

    this._imageRescaleStyle = ""; 
    this._imageFrameColor = "";
    this._changeFileButtonHtml = "";

    /**
     * Defines the project
     * @param   projectName: name for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     * @param   projectPassword: password for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     */
    this.defineProjectSettings = function(projectName, projectPassword, debugMode) {

        debugMode = typeof debugMode !== 'undefined' ? debugMode : false;

        this._projectName =      projectName;
        this._projectPassword =  projectPassword;
        this._debugMode =        debugMode;
    };

    this.defineModuleConfigObject = function(moduleConfigObject) {
        this._moduleConfigObject =      moduleConfigObject;
    };
    


    /**
     * initialises all forms, based on the this._moduleConfigObject.fileUploadModule.uploadFiles
     * @param   imageUploadWrapper: name for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     * @param   varObj.externalReferenceString: this is the primary identifier for your cosmos. This must be unique for each item users are voting on. This is what identifies what votes are tallied against. This can be any string, including numbers and spaces.
     * @param   varObj: this defines callback events for onComplete and success.
     */
    this.initAllUploadImageForms = function(imageUploadWrapper, varObj) {

        imageUploadFormWrapper = imageUploadWrapper+' .cosmos-file-upload-form-wrapper .upload-image-form';        
        this._imageUploadWrapper = imageUploadWrapper;

        // checks if the item has an upload file element
        var uploadFiles = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.uploadFiles');         
        if(uploadFiles){

            // ALLOWS UPLOAD FILES
            this._maximumFilesPerItem = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.maximumFilesPerItem');
            if(this._maximumFilesPerItem !== ""){
                for (var i=0, max=this._maximumFilesPerItem; i < max; i++) {

                    // copy the form element
                    var newImageUploadFormWrapper = $(imageUploadFormWrapper).clone();

                    var oldClassName = newImageUploadFormWrapper.attr('class');
                    var newClassName = newImageUploadFormWrapper.attr('class')+(i+1);
                    var nextClassName = newImageUploadFormWrapper.attr('class')+(i+2);
                    newImageUploadFormWrapper.removeClass(oldClassName);
                    newImageUploadFormWrapper.addClass(newClassName);

                    newImageUploadFormWrapper.appendTo(imageUploadWrapper);

                    var newImageUploadFormWrapperString = imageUploadWrapper+" ."+newClassName;

                    varObj.nextImageUploadFormWrapper = imageUploadWrapper+" ."+nextClassName;
                    var newModule = new Cosmos.Data.ImageUploader();
                    newModule.defineModuleConfigObject(this._moduleConfigObject);
                    newModule.defineProjectSettings(this._projectName, this._projectPassword, true);
                    newModule.initUploadImageForm(imageUploadWrapper, newImageUploadFormWrapperString, varObj);
                    
                    this._imageUploadFormArray.push(newModule);

                    // hides it if it isn't the first uploader
                    if(i !== 0){
                        $(newImageUploadFormWrapperString).hide();
                    }

                    // removes the template
                    if(i === max-1){
                        $(imageUploadFormWrapper).remove();
                    }
                    
                }
            } 
            
        } else {
            // DOES NOT ALLOW FILE UPLOADS
            // removes the upload html
            if($(imageUploadFormWrapper)){
                $(imageUploadFormWrapper).remove();
            }
            
        }
        
    };

    this.updateAllImageForms = function(updateModuleConfigObject) {

        var imageFields = Cosmos.Data.Traverse(updateModuleConfigObject, 'fileUploadModule.imageFields');

        // clears all the fields
        this.clearAllImageForms();

        // adds the images
        if(imageFields !== ""){
            for (var j=0, maxj=imageFields.length; j < maxj; j++) {

                var thumbnailImage =            Cosmos.Data.Traverse(imageFields[j], 'thumbnailImage'); 
                var uploaded_image_id =         Cosmos.Data.Traverse(imageFields[j], 'uploaded_image_id'); 
                var uploaded_image_caption =    Cosmos.Data.Traverse(imageFields[j], 'uploaded_image_caption'); 
                var uploaded_image_source =     Cosmos.Data.Traverse(imageFields[j], 'uploaded_image_source'); 

                this._imageUploadFormArray[j].addImageElement(thumbnailImage, uploaded_image_id, uploaded_image_caption, uploaded_image_source);

                if(j > maxj-2){
                    $(this._imageUploadFormArray[j]._imageUploadFormWrapper+' .cosmos-file-attach-another-wrapper').show(); 
                }
                

            }
        }

    };

    this.clearAllImageForms = function() {

        // clears all the fields
        for (var i=0, max=this._imageUploadFormArray.length; i < max; i++) {
            this._imageUploadFormArray[i].deleteImageInstance();
            $(this._imageUploadFormArray[i]._imageUploadFormWrapper).hide();
        }
        
        if(this._imageUploadFormArray.length > 0){
            $(this._imageUploadFormArray[0]._imageUploadFormWrapper).show();
        }
        

    };


    /**
     * initialises a form, to prepare for uploading. defineProjectSettings must be called first
     * @param   imageUploadWrapper: element identification
     * @param   imageUploadFormWrapper: element identification
     * @param   varObj: this defines callback events for onComplete and success.
     */
    this.initUploadImageForm = function(imageUploadWrapper, imageUploadFormWrapper, varObj) {
        
        this._imageUploadWrapper = imageUploadWrapper;
        this._imageUploadFormWrapper = imageUploadFormWrapper;
        this._varObj = varObj;

        varObj = typeof varObj !== 'undefined' ? varObj : {};
        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        if(varObj.external_reference_string === ""){
            varObj.external_reference_string = "autoincrement";
        }

        varObj.complete = Cosmos.Data.Traverse(varObj, 'complete'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success'); 
        varObj.progress = Cosmos.Data.Traverse(varObj, 'progress'); 
        varObj.nextImageUploadFormWrapper = Cosmos.Data.Traverse(varObj, 'nextImageUploadFormWrapper'); 
        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 

        var fileUploadInputFields = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.fileUploadInputFields');
        var varObjNextImageUploadFormWrapper = varObj.nextImageUploadFormWrapper;
        
        this._changeFileButtonHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.changeFileButtonHtml'); 
        this._imageRescaleStyle = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.imageRescaleStyle'); 
        this._imageFrameColor = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.imageFrameColor'); 

        var me = this;

        
        var ajaxOptions = {

            // dataType identifies the expected content type of the server response 
            dataType:  'xml',

            success: function(xhr) {

                var thumbnailImage = $("uploaded_image_path_320", xhr).text();
                var uploaded_image_id = $("uploaded_image_id", xhr).text();

                me.addImageElement(thumbnailImage, uploaded_image_id, "", "");

                if(varObj.success !== ''){
                    varObj.success(xhr, me._imageUploadFormWrapper);
                }

                if(this._debugMode) console.log(xhr);

                if($("ErrorMessage", xhr).text()){
                    if(me._debugMode) console.log($("ErrorMessage", xhr).text());
                } else {
                    if(me._debugMode) console.log("uploaded_image_id: "+$("uploaded_image_id", xhr).text()+" | uploaded_image_path_75: "+$("uploaded_image_path_75", xhr).text());
                    if(me._debugMode) console.log("uploaded_image_caption: "+$("uploaded_image_caption", xhr).text());
                    if(me._debugMode) console.log("uploaded_image_source: "+$("uploaded_image_source", xhr).text());
                    //$(this._imageUploadFormWrapper).append('<img src="'+imageResponseObject.uploadedImagePath75+'">');
                }

            },
            complete: function(xhr) {
                if(varObj.complete !== ''){
                    varObj.complete(xhr, me._imageUploadFormWrapper);
                }
                
            },
            beforeSubmit: function() {
                // public variable declaring the image progress
                me._fileUpload.begun = true;

                $(me._imageUploadFormWrapper+" :submit").attr("disabled", true);
                $(me._imageUploadFormWrapper+' .cosmos-file-upload-progressbar-wrapper').show();
                $(me._imageUploadFormWrapper+' .cosmos-file-upload-buttonbar-wrapper').hide();
                $(me._imageUploadFormWrapper+' .cosmos-file-upload-delete-wrapper').hide();

                if(fileUploadInputFields !== ""){
                    $(me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper').show();                   
                }
                if(varObj.beforeSubmit !== ''){
                    varObj.beforeSubmit(me._imageUploadFormWrapper);
                }

                if($(varObjNextImageUploadFormWrapper).length !== 0){
                    $(me._imageUploadFormWrapper+' .cosmos-file-attach-another-wrapper').show(); 
                }  
            },
            uploadProgress: function(event, position, total, percentComplete) {
                if(varObj.progress !== ''){
                    varObj.progress(event, position, total, percentComplete, me._imageUploadFormWrapper);
                }
                $(me._imageUploadFormWrapper+' .cosmos-file-upload-progressbar-inner').css({'width':percentComplete+'%'});

                if(percentComplete > 99){
                    $(me._imageUploadFormWrapper+' .cosmos-file-upload-finalizing-wrapper').show();
                    $(me._imageUploadFormWrapper+' .cosmos-file-upload-progressbar-wrapper').hide();
                }
                
            }

        };
        // sets up the form as an ajax form
        $(me._imageUploadFormWrapper).ajaxForm(ajaxOptions); 

        // adds external reference details
        $('<input>').attr({
            type: 'hidden',
            name: 'external_reference_string',
            value: varObj.external_reference_string
        }).appendTo(me._imageUploadFormWrapper);
        
        // adds project details
        $('<input>').attr({
            type: 'hidden',
            name: 'project_name',
            value: this._projectName
        }).appendTo(me._imageUploadFormWrapper);

        // adds project details
        $('<input>').attr({
            type: 'hidden',
            name: 'project_password',
            value: this._projectPassword
        }).appendTo(me._imageUploadFormWrapper);

        // cachebusting details
        var currentTime = new Date();
        var n = currentTime.getTime();
        $('<input>').attr({
            type: 'hidden',
            name: 'cacheBuster',
            value: n
        }).appendTo(me._imageUploadFormWrapper);


        $(me._imageUploadFormWrapper+' input[name="filedata"]').change(function() { 
            // checks if the value was changed to ""
            if($(this).val() !== ""){
                // VALUE IS NOT ""
                // submit form
                $(me._imageUploadFormWrapper).ajaxSubmit(ajaxOptions); 
            }
            
        });


        $(me._imageUploadFormWrapper+" :submit").attr("disabled", false);




        // resets the file field so users can select the same image twice
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-buttonbar-wrapper').bind('click', function() { 
            // clears the value so the same file could be attached again
            me.deleteImageInstance();          
        });


        // deletes the file field so users can select the same image twice
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-delete-button').bind('click', function() { 
            // clears the value so the same file could be attached again  
            me.deleteImageInstance();
        });

        // attaches another image when button clicked
        $(me._imageUploadFormWrapper+" .cosmos-file-attach-another-button").bind("click", function() {
            $(me._imageUploadFormWrapper+" .cosmos-file-attach-another-wrapper").hide();
            if($(varObjNextImageUploadFormWrapper).length !== 0){                
                $(varObjNextImageUploadFormWrapper).show();
            }
            
        });
        


        me.defineUploadButtonText();

        
        var uploadFileTitleHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.uploadFileTitleHtml');
        if(uploadFileTitleHtml !== ""){
            $(this._imageUploadWrapper+' .cosmos-file-upload-title').html(uploadFileTitleHtml);
        }    
        var uploadFileIntroductionHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.uploadFileIntroductionHtml');
        if(uploadFileIntroductionHtml !== ""){
            $(this._imageUploadWrapper+' .cosmos-file-upload-introduction').html(uploadFileIntroductionHtml);
        }   
        var uploadFileFinalizingHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.uploadFileFinalizingHtml');
        if(uploadFileFinalizingHtml !== ""){
            $(this._imageUploadWrapper+' .cosmos-file-upload-finalizing-wrapper').html(uploadFileFinalizingHtml);
        }  
        var attachAnotherFileButtonHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.attachAnotherFileButtonHtml');
        if(attachAnotherFileButtonHtml !== ""){
            $(this._imageUploadWrapper+' .cosmos-file-attach-another-button').html(attachAnotherFileButtonHtml);
        }
        var deleteFileButtonHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.deleteFileButtonHtml');
        if(deleteFileButtonHtml !== ""){
            $(me._imageUploadFormWrapper+' .cosmos-file-upload-delete-button').html(deleteFileButtonHtml);
        }


        $(me._imageUploadFormWrapper+' .cosmos-file-upload-progressbar-wrapper').hide();
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-delete-wrapper').hide(); 
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-finalizing-wrapper').hide(); 
        var progressiveTextAttributes = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.progressiveTextAttributes');
        if(!$.browser.msie && progressiveTextAttributes === true) $(me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper').hide(); 
        $(me._imageUploadFormWrapper+' .cosmos-file-attach-another-wrapper').hide(); 


        // ADDS ALL THE FIELDS TO THE FILE UPLOAD ELEMENT
        var targetFileUploadFieldWrapper = me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper';
        if(fileUploadInputFields !== ""){
            for (var i=0, max=fileUploadInputFields.length; i < max; i++) {
                Cosmos.Data.createInputFeildElement(targetFileUploadFieldWrapper, fileUploadInputFields[i]);
            }
        }


        // gives all textfields ghost text on old browsers
        $('input, textarea').placeholder();

    };

    // reconfigures styles to begin with
    this.deleteImageInstance = function () {
            
        var me = this;

        $(me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper input').not(':button, :submit, :reset, :hidden').val('');
        
        $(me._imageUploadFormWrapper+' #file').val(''); 
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-delete-wrapper').hide();
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper').hide(); 
        $(me._imageUploadFormWrapper+' .cosmos-file-attach-another-wrapper').hide(); 


        $(me._imageUploadFormWrapper+' .cosmos-file-change-button-text').addClass('cosmos-file-upload-button');
        $(me._imageUploadFormWrapper+' .cosmos-file-change-button-text').removeClass('cosmos-file-change-button-text');

        $(me._imageUploadFormWrapper+' .cosmos-image-placeholder').html('');

        me.defineUploadButtonText();

        me._fileUpload.begun = false;
        me._fileUpload.success = false;
        me._fileUpload.uploaded_image_id = "";
    };


        // 'upload' button text
    this.defineUploadButtonText = function () {
        me = this;
        var buttonHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.uploadFileButtonHtml');
        if(buttonHtml !== ""){
            $(me._imageUploadFormWrapper+' .cosmos-file-upload-button .cosmos-file-upload-button-text').html(buttonHtml);
        }
    };

    this.addImageElement = function(thumbnailImage, uploaded_image_id, uploaded_image_caption, uploaded_image_source) {

        me = this;

        $(me._imageUploadFormWrapper).show();


        // public variable declaring the image progress
        me._fileUpload.uploaded_image_id = uploaded_image_id;

        // public variable declaring the image progress
        me._fileUpload.begun = true;
        me._fileUpload.success = true;
        
        // upload button text
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-progressbar-wrapper').hide();
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-buttonbar-wrapper').show();
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-delete-wrapper').show();
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-finalizing-wrapper').hide();

        var fileUploadInputFields = Cosmos.Data.Traverse(this._moduleConfigObject, 'fileUploadModule.fileUploadInputFields');
        if(fileUploadInputFields !== ""){
            $(me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper').show(); 
        }

        if(me._changeFileButtonHtml !== ""){
            $(me._imageUploadFormWrapper+' .cosmos-file-upload-button .cosmos-file-upload-button-text').html(me._changeFileButtonHtml);
        }
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-button').addClass('cosmos-file-change-button-text');
        $(me._imageUploadFormWrapper+' .cosmos-file-upload-button').removeClass('cosmos-file-upload-button');
        
        var _il = new Cosmos.Utils.ImageLoaderWithRescaleSlideShow(me._imageUploadFormWrapper+' .cosmos-image-placeholder', [{"img":thumbnailImage, "background-color":me._imageFrameColor}], 200, 200, me._imageRescaleStyle, "centreEnabled", "elementResizeListenerDisabled");
        
        if($(me._imageUploadFormWrapper+' input[name="uploaded_image_caption"]').length && uploaded_image_caption !== ""){
            $(me._imageUploadFormWrapper+' input[name="uploaded_image_caption"]').val(uploaded_image_caption);
        }
        if($(me._imageUploadFormWrapper+' input[name="uploaded_image_source"]').length && uploaded_image_source !== ""){
            $(me._imageUploadFormWrapper+' input[name="uploaded_image_source"]').val(uploaded_image_source);
        }
        //if($(me._imageUploadFormWrapper+' .cosmos-file-upload-text-attributes-wrapper').show(); )


    };


    this.changeUploadImageFormExternalReferenceString = function(imageUploadFormWrapper, external_reference_string) {
        if($('input[name="external_reference_string"]')){
            $('input[name="external_reference_string"]').remove();
        }
        if($('input[name="project_name"]')){
            $('input[name="project_name"]').remove();
        }
        if($('input[name="project_password"]')){
            $('input[name="project_password"]').remove();
        }
        // adds external reference details
        $('<input>').attr({
            type: 'hidden',
            name: 'external_reference_string',
            value: external_reference_string
        }).appendTo(this._imageUploadFormWrapper);

        // adds project details
        $('<input>').attr({
            type: 'hidden',
            name: 'project_name',
            value: this._projectName
        }).appendTo(this._imageUploadFormWrapper);

        // adds project details
        $('<input>').attr({
            type: 'hidden',
            name: 'project_password',
            value: this._projectPassword
        }).appendTo(this._imageUploadFormWrapper);

    };



    /////////////////////////
    // UPDATES THE DATABASE
    // 
    
    
    this.update = function(varObj) {

        me = this;

        varObj = typeof varObj !== 'undefined' ? varObj : {};        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        if(varObj.external_reference_string !== ""){
            $(this._imageUploadFormWrapper+' input[name="external_reference_string"]').val(varObj.external_reference_string);
        }
        
        
        
        varObj.external_reference_string = $(this._imageUploadFormWrapper+' input[name="external_reference_string"]').val();
        varObj.unique_reference_id = Cosmos.Data.Traverse(varObj, 'unique_reference_id'); 
        varObj.uploaded_image_id = me._fileUpload.uploaded_image_id; 
        varObj.uploaded_image_caption = $(this._imageUploadFormWrapper+' input[name="uploaded_image_caption"]').val();
        varObj.uploaded_image_source = $(this._imageUploadFormWrapper+' input[name="uploaded_image_source"]').val();
        

        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success');  
        varObj.dataType = Cosmos.Data.Traverse(varObj, 'dataType'); 

        if(varObj.dataType === ""){
            varObj.dataType = "json";
        }

        this._varObj = varObj;

        var dataObj = {};

        dataObj.project_name = this._projectName;
        dataObj.project_password = this._projectPassword;
        dataObj.external_reference_string = varObj.external_reference_string;
        dataObj.unique_reference_id = varObj.unique_reference_id;
        dataObj.uploaded_image_id = varObj.uploaded_image_id;
        dataObj.uploaded_image_caption = varObj.uploaded_image_caption;
        dataObj.uploaded_image_source = varObj.uploaded_image_source;

        
        if(varObj.beforeSubmit !== ''){
            varObj.beforeSubmit(dataObj);
        }

        $.ajax({
            url: Cosmos.Config.ServiceUrl+"update_uploaded_image/",
            data: dataObj,
            dataType: varObj.dataType,
            success: function(xhr) {
                if(varObj.success !== ''){
                    varObj.success(xhr);
                }
                if(me._debugMode) console.log(xhr);
            }
        });
        

    };

};





Cosmos.Data.ItemForm = function() {

    // variables that are defined in defineProjectSettings();
    this._projectName =      "";
    this._projectPassword =  "";
    this._debugMode =        "";
    this._moduleConfigObject =       "";
    this._varObj = {};

    // module name
    this._moduleName = "primary";

    // an array of ImageUploader objects, when initAllUploadImageForm() is used
    this._imageUploadFormArray =   [];

    this._request = {};
    this._request.begun = false;
    this._request.success = false;
    this._request.uploaded_image_id = "";
    this._itemWrapper = "";
    this._cosmosDataImageUploader = "";
    this._cosmosDataThanks = "";


    /**
     * Defines the project
     * @param   projectName: name for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     * @param   projectPassword: password for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     */
    this.defineProjectSettings = function(projectName, projectPassword, debugMode) {

        debugMode = typeof debugMode !== 'undefined' ? debugMode : false;

        this._projectName =      projectName;
        this._projectPassword =  projectPassword;
        this._debugMode =        debugMode;
    };

    this.defineModuleConfigObject = function(moduleConfigObject) {
        this._moduleConfigObject =      moduleConfigObject;
    };

    this.defineModuleName = function(moduleName) {
        this._moduleName =      moduleName;
    };


    /**
     * initialises a form, to prepare for uploading. defineProjectSettings must be called first
     * @param   imageUploadWrapper: element identification
     * @param   imageUploadFormWrapper: element identification
     * @param   varObj: this defines callback events for onComplete and success.
     */
    this.initItemForm = function(itemWrapper, varObj) {
        var me = this;
        this._itemWrapper = itemWrapper;

        varObj = typeof varObj !== 'undefined' ? varObj : {};
        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        /*if(varObj.external_reference_string === ""){
            varObj.externalReferenceString = "autoincrement";
        }*/

        varObj.complete = Cosmos.Data.Traverse(varObj, 'complete'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success'); 
        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 

        varObj.cosmosDataImageUploader = Cosmos.Data.Traverse(varObj, 'cosmosDataImageUploader'); 
        this._cosmosDataImageUploader = varObj.cosmosDataImageUploader;

        varObj.cosmosDataThanks = Cosmos.Data.Traverse(varObj, 'cosmosDataThanks'); 
        this._cosmosDataThanks = varObj.cosmosDataThanks;

        this._varObj = varObj;


        var ajaxOptions = {


            success: function(xhr) {

                // public variable declaring the form progress
                me._request.success = true;

                if(varObj.success !== ''){
                    varObj.success(xhr, me._itemWrapper);
                }
                ///////////////////////////////////////////////////////////////////////////////////
                //updateAllImageUploadInDatabase

                if(varObj.cosmosDataImageUploader !== ""){
                    // IMAGE UPLOAD EXISTS
                    
                    for (var i=0, max=varObj.cosmosDataImageUploader._imageUploadFormArray.length; i < max; i++) {

                        var tempFileUpload = varObj.cosmosDataImageUploader._imageUploadFormArray[i]._fileUpload;


                        if (tempFileUpload.success === true){

                            $.extend(xhr, imageAjaxOptions);
                            varObj.cosmosDataImageUploader._imageUploadFormArray[i].update(xhr);
                        }

                    }

                    if(me._request.imagesRequiredToUpdate === 0){
                        me.gotoThanks();
                    }
                } else {
                    // IMAGE UPLOAD DOES NOT EXIST
                    me.gotoThanks();
                }



            },
            beforeSubmit: function() {
                // public variable declaring the image progress
                me._request.begun = true;
                me._request.imagesUpdated = 0;
                me._request.imagesRequiredToUpdate = 0;

                if(varObj.beforeSubmit !== ''){
                    varObj.beforeSubmit(me._itemWrapper);
                }


            }

        };


        var imageAjaxOptions = {


            success: function(xhr) {
                // public variable declaring the form progress

                if(varObj.success !== ''){
                    varObj.success(xhr, me._itemWrapper);
                }
                
                me._request.imagesUpdated++;
                if(me._request.imagesUpdated === me._request.imagesRequiredToUpdate){
                    
                    me.gotoThanks();
                }



            },
            beforeSubmit: function() {
                // public variable declaring the image progress

                if(varObj.beforeSubmit !== ''){
                    varObj.beforeSubmit(me._itemWrapper);
                }

                me._request.imagesRequiredToUpdate++;
            }

        };

        // adds the title
        var itemDetailsTitleHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'itemDetailsModule.itemDetailsTitleHtml');
        if(itemDetailsTitleHtml !== ""){
            $(itemWrapper+' .cosmos-item-title').html(itemDetailsTitleHtml);
        }    
        var itemDetailsIntroductionHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'itemDetailsModule.itemDetailsIntroductionHtml');
        if(itemDetailsIntroductionHtml !== ""){
            $(itemWrapper+' .cosmos-item-introduction').html(itemDetailsIntroductionHtml);
        }   
        var submitItemButtonHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'itemDetailsModule.submitItemButtonHtml');
        if(submitItemButtonHtml !== ""){
            $(itemWrapper+' .cosmos-item-submit-button').html(submitItemButtonHtml);
        }    
        var submittingItemHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'itemDetailsModule.submittingItemHtml');
        if(submitItemButtonHtml !== ""){
            $(itemWrapper+' .cosmos-item-submitting-item-wrapper').html(submittingItemHtml);
            $(itemWrapper+' .cosmos-item-submitting-item-wrapper').hide();
        } 


        // adds external reference details
        //if(varObj.external_reference_string !== ""){
            $('<input>').attr({
                type: 'hidden',
                name: 'external_reference_string',
                value: varObj.external_reference_string
            }).appendTo(itemWrapper+" .cosmos-item-details-form-wrapper");                
        //}
        
        // adds project details
        $('<input>').attr({
            type: 'hidden',
            name: 'project_name',
            value: this._projectName
        }).appendTo(itemWrapper+" .cosmos-item-details-form-wrapper");

        // adds project details
        $('<input>').attr({
            type: 'hidden',
            name: 'project_password',
            value: this._projectPassword
        }).appendTo(itemWrapper+" .cosmos-item-details-form-wrapper");

        // cachebusting details
        var currentTime = new Date();
        var n = currentTime.getTime();
        $('<input>').attr({
            type: 'hidden',
            name: 'cacheBuster',
            value: n
        }).appendTo(itemWrapper+" .cosmos-item-details-form-wrapper");



        ////////////////////////////////
        // CLICKS THE SUBMIT BUTTON
        $(itemWrapper+' .cosmos-item-submit-button').bind("click", function() {

            $(itemWrapper+' .cosmos-item-submit-wrapper').hide();
            $(itemWrapper+' .cosmos-item-submitting-item-wrapper').show();

            if(varObj.cosmosDataImageUploader !== ""){
                detectIfAllFilesAreUploaded();
            } else {
                me.submitItemData(ajaxOptions);
            }
            
        });


        

        // 'upload' button text
        function detectIfAllFilesAreUploaded() {     

            var filesUploaded = true;       
            
            for (var i=0, max=varObj.cosmosDataImageUploader._imageUploadFormArray.length; i < max; i++) {
                var tempFileUpload = varObj.cosmosDataImageUploader._imageUploadFormArray[i]._fileUpload;
                //if(this._debugMode) console.log(tempFileUpload);

                if (tempFileUpload.begun === true && tempFileUpload.success !== true){
                    filesUploaded = false;
                }

            }


            if(filesUploaded === true){
                // FILES UPLOADED!
                me.submitItemData(ajaxOptions);

            } else {
                // FILES NOT UPLOADED YET!
                
                // try again
                setTimeout(detectIfAllFilesAreUploaded,500);
            }



        }





        // ADDS ALL THE FIELDS TO THE FILE UPLOAD ELEMENT
        var itemInputFields = Cosmos.Data.Traverse(this._moduleConfigObject, 'itemDetailsModule.itemDetailsInputFields');
        var targetItemFieldWrapper = itemWrapper+" .cosmos-item-details-form-wrapper";
        if(itemInputFields !== ""){
            for (var i=0, max=itemInputFields.length; i < max; i++) {
                Cosmos.Data.createInputFeildElement(targetItemFieldWrapper, itemInputFields[i]);
            }
        }

        ////////////////////////////////
        // CLICKS THE SUBMIT BUTTON
        var parentWrapperArray = itemWrapper.split(" ");
        var parentWrapper = parentWrapperArray[0];
        $(parentWrapper+' .cosmos-modal-close-button').bind("click", function() {
            me.hideModal();
        });
        $(parentWrapper+' .cosmos-modal-backdrop').bind("click", function() {
            me.hideModal();
        });

        $('.cosmos-modal-open-'+this._projectName+'-'+this._moduleName).bind("click", function() {
            me.checkButtonDataAttributes(this);
            me.showModal();
        });

        // gives all textfields ghost text on old browsers
        $('input, textarea').placeholder();



    };

    this.submitItemData = function(ajaxOptions) {
    //function submitItemData() { 
        
        var me = this;

        var passValidation = true;

        var allInputs = $(me._itemWrapper+' .cosmos-item-details-form-wrapper :input');

        var itemInputFields = Cosmos.Data.Traverse(this._moduleConfigObject, 'itemDetailsModule.itemDetailsInputFields');
        if(itemInputFields !== ""){
            for (var i=0, max=itemInputFields.length; i < max; i++) {
                var itemInputFieldObj = itemInputFields[i];

                var mandatoryField = Cosmos.Data.Traverse(itemInputFieldObj, 'mandatoryField');
                var fieldType = Cosmos.Data.Traverse(itemInputFieldObj, 'fieldType');

                var fieldValue = "";
                var fieldElement = me._itemWrapper+' .cosmos-item-details-form-wrapper [name="'+itemInputFieldObj.databaseLabel+'"]';
                if($(fieldElement).is(':checkbox')){
                    // get true/false value for checkboxs
                    fieldValue = $(fieldElement).prop('checked');
                } else {
                    // gets the value in the textfield
                    fieldValue = $(fieldElement).val();
                    if(fieldValue == ""){
                        fieldValue = " ";
                        $(fieldElement).val(" ")
                    }       

                }

                var parentElement = $(fieldElement).parents(".cosmos-field-wrapper");
                parentElement.removeClass("cosmos-validation-error");

                
                if(fieldType !== "html"){
                    if(mandatoryField == true){
                        if(fieldValue == false || fieldValue === "" || fieldValue == " "){
                            passValidation = false;
                            parentElement.addClass("cosmos-validation-error");
                        }
                    }

                }
            }
        }



        if(passValidation === true) {
            // VALID FORM

            // get an associative array of just the values.
            var values = {};
            allInputs.each(function() {
                if($(this).is(':checkbox')){
                    // get true/false value for checkboxs
                    values[this.name] = $(this).prop('checked');
                } else {
                    // gets the value in the textfield
                    values[this.name] = $(this).val();
                }
            });
            //values = allForm.serialize();
            values.cosmos_force = 1;

            $.extend(values, ajaxOptions);

            // save
            var _cosmoDataItem = new Cosmos.Data.Item();
            _cosmoDataItem.defineProjectSettings(me._projectName, me._projectPassword, true);           
            _cosmoDataItem.save(values);
        } else {
            // INVALID FORM
            
            $(me._itemWrapper+' .cosmos-item-submit-wrapper').show();
            $(me._itemWrapper+' .cosmos-item-submitting-item-wrapper').hide();
        }
        

    }

    this.showModal = function() {
        var parentWrapperArray = this._itemWrapper.split(" ");
        var parentWrapper = parentWrapperArray[0];
        $(parentWrapper+' .cosmos-modal').css("top", window.pageYOffset);
        $(parentWrapper+' .cosmos-modal').show();
        $(parentWrapper+' .cosmos-modal-backdrop').show();
    }
    this.hideModal = function() {
        var parentWrapperArray = this._itemWrapper.split(" ");
        var parentWrapper = parentWrapperArray[0];
        $(parentWrapper+' .cosmos-modal').hide();
        $(parentWrapper+' .cosmos-modal-backdrop').hide();
    }



    this.checkButtonDataAttributes = function(targButton) {
        me = this;

        if($(targButton).attr('data-config-object')){
            var updateModuleConfigObject = window[$(targButton).attr('data-config-object')];
            this.updateItemForm(updateModuleConfigObject);
            if(me._cosmosDataImageUploader){
                me._cosmosDataImageUploader.updateAllImageForms(updateModuleConfigObject);
            }
            
        }
    }

    this.updateItemForm = function(updateModuleConfigObject) {

        me = this;


        updateModuleConfigObject = typeof updateModuleConfigObject !== 'undefined' ? updateModuleConfigObject : {};
        var targetItemFieldWrapper = me._itemWrapper+" .cosmos-item-details-form-wrapper"; 
        
        // clear all input fields first
        $(targetItemFieldWrapper+" input").val("");
        $(targetItemFieldWrapper+" textarea").val("");

        // loops through fields and 
        var itemInputFields = Cosmos.Data.Traverse(updateModuleConfigObject, 'itemDetailsModule.itemDetailsInputFields');
        
        for (var i=0, max=itemInputFields.length; i < max; i++) {
            Cosmos.Data.updateInputFeildElement(targetItemFieldWrapper, itemInputFields[i]);
        }

        $(targetItemFieldWrapper+' .cosmos-item-submit-wrapper').show();
       

        //$(targetItemFieldWrapper+' input').not(':button, :submit, :reset, :hidden').val('');


        var external_reference_string = Cosmos.Data.Traverse(updateModuleConfigObject, 'itemDetailsModule.external_reference_string');
        if(external_reference_string !== ""){

        }

        
    };

    this.gotoThanks = function() {

        me = this;

        var targetItemFieldWrapper = me._itemWrapper+" .cosmos-item-details-form-wrapper"; 
        
        // clear all input fields first
        $(targetItemFieldWrapper+" input").val("");
        $(targetItemFieldWrapper+" textarea").val("");


        $(me._itemWrapper+' .cosmos-item-submit-wrapper').show();
        $(me._itemWrapper+' .cosmos-item-submitting-item-wrapper').hide();

        $(me._itemWrapper).hide();

        if(this._cosmosDataImageUploader !== ""){
            this._cosmosDataImageUploader.clearAllImageForms();
            $(this._cosmosDataImageUploader._imageUploadWrapper).hide();
        }

        if(this._cosmosDataThanks !== ""){
            $(this._cosmosDataThanks._thanksWrapper).show();
        }

        // refreshes the page if set to do so
        if(Cosmos.Data.Traverse(this, '_cosmosDataThanks._moduleConfigObject.thanksModule.thanksAutoRefresh')) {
            location.reload();
        } 
        // anchors the page if set to do so
        var anchor = Cosmos.Data.Traverse(this, '_cosmosDataThanks._moduleConfigObject.thanksModule.thanksAnchorTo');
        if(anchor) {
            $('html,body').animate({scrollTop: ($('#'+anchor).offset().top - 80)}, 200);
        } 


    };

};





Cosmos.Data.Thanks = function() {

    // variables that are defined in defineProjectSettings();
    this._projectName =      "";
    this._projectPassword =  "";
    this._debugMode =        "";
    this._moduleConfigObject =       "";
    this._varObj = {};


    this._thanksWrapper = "";


    /**
     * Defines the project
     * @param   projectName: name for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     * @param   projectPassword: password for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     */
    this.defineProjectSettings = function(projectName, projectPassword, debugMode) {

        debugMode = typeof debugMode !== 'undefined' ? debugMode : false;

        this._projectName =      projectName;
        this._projectPassword =  projectPassword;
        this._debugMode =        debugMode;
    };

    this.defineModuleConfigObject = function(moduleConfigObject) {
        this._moduleConfigObject =      moduleConfigObject;
    };


    /**
     * initialises a form, to prepare for uploading. defineProjectSettings must be called first
     * @param   imageUploadWrapper: element identification
     * @param   imageUploadFormWrapper: element identification
     * @param   varObj: this defines callback events for onComplete and success.
     */
    this.initThanks = function(thanksWrapper, varObj) {
        var me = this;
        this._thanksWrapper = thanksWrapper;

        varObj = typeof varObj !== 'undefined' ? varObj : {};

        // adds the title
        var thanksTitleHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'thanksModule.thanksTitleHtml');
        if(thanksTitleHtml !== ""){
            $(this._thanksWrapper+' .cosmos-thanks-title').html(thanksTitleHtml);
        }    
        var thanksIntroductionHtml = Cosmos.Data.Traverse(this._moduleConfigObject, 'thanksModule.thanksIntroductionHtml');
        if(thanksIntroductionHtml !== ""){
            $(this._thanksWrapper+' .cosmos-thanks-introduction').html(thanksIntroductionHtml);            
        }

        $(this._thanksWrapper).hide();

        
    };
}









Cosmos.Data.updateInputFeildElement = function(targetWrapper, inputFieldObj) {


    $(targetWrapper+' input[name="'+inputFieldObj.databaseLabel+'"]').val(inputFieldObj.valueText);

    $(targetWrapper+' textarea[name="'+inputFieldObj.databaseLabel+'"]').val(inputFieldObj.valueText);

};




Cosmos.Data.createInputFeildElement = function(targetWrapper, inputFieldObj) {
    //console.log(inputFieldObj);
    
    var inputHtml = '';
    switch(inputFieldObj.fieldType) {
        case "html":
            // CUSTOM HTML
            inputHtml += inputFieldObj.userFacingHtml;

            break;
        case "checkbox":
            // CHECK BOX
            inputHtml += '<div class="cosmos-field-wrapper '+inputFieldObj.fieldSize+'">';
            inputHtml += '<input type="checkbox" name="'+inputFieldObj.databaseLabel+'" class="cosmos-checkbox"><div class="cosmos-checkbox-text">'+inputFieldObj.checkboxHtml+'</div>';
            inputHtml += '</div>';

            break;
        case "text":
            // TEXT INPUT
            inputHtml += '<div class="cosmos-field-wrapper '+inputFieldObj.fieldSize+'">';

            if(inputFieldObj.userFacingLabel){
                inputHtml += '<div class="cosmos-field-label">'+inputFieldObj.userFacingLabel+'</div>';
            }

            var additionalAttributes = "";
            if(inputFieldObj.readOnlyField){
                additionalAttributes += ' readonly="readonly" ';
            }// 
            // checks if it's a large textfield
            if(inputFieldObj.fieldSize !== "cosmos-field-tiny" && inputFieldObj.fieldSize !== "cosmos-field-small" && inputFieldObj.fieldSize !== "cosmos-field-medium"){
                // MULTIROW TEXTAREA
                var rows = "";
                if (inputFieldObj.fieldSize === "cosmos-field-large"){
                    rows = 2;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xlarge"){
                    rows = 3;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxlarge"){
                    rows = 4;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxxlarge"){
                    rows = 5;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxxxlarge"){
                    rows = 6;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxxxxlarge"){
                    rows = 7;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxxxxxlarge"){
                    rows = 8;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxxxxxxlarge"){
                    rows = 9;
                } else if (inputFieldObj.fieldSize === "cosmos-field-xxxxxxxxlarge"){
                    rows = 10;
                }
                //inputHtml += '<textarea>sdfg</textarea>';
                inputHtml += '<textarea name="'+inputFieldObj.databaseLabel+'" rows="'+rows+'" class="cosmos-field" placeholder="'+inputFieldObj.placeholderText+'" '+additionalAttributes+' value="'+inputFieldObj.valueText+'" >'+inputFieldObj.valueText+'</textarea>';
            } else {
                // SINGLE ROW
                inputHtml += '<input type="text" name="'+inputFieldObj.databaseLabel+'" class="cosmos-field" placeholder="'+inputFieldObj.placeholderText+'" value="'+inputFieldObj.valueText+'" '+additionalAttributes+' >';
            }
            //$('[name="'+inputFieldObj.databaseLabel+'"]').val("hi");
            inputHtml += '</div>';

            break;

        case 2:

            break;
        default:
            break;
          
    }
    $(targetWrapper).append(inputHtml);
    
};

Cosmos.Data.Traverse = function( val, names ) {
    names = names.split( '.' );           
    while ( val && names.length ) { val = val[ names.shift() ]; }    

    if (typeof val == "undefined"){
        val = "";
    }
    return val;
};



    




Cosmos.Data.Item = function() {


    // variables that are defined in defineProjectSettings();
    this._projectName =      "";
    this._projectPassword =  "";
    this._debugMode =        "";
    this._varObj =           {};


    /**
     * Defines the project
     * @param   projectName: name for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     * @param   projectPassword: password for the project (please refer to http://cosmos.is/admin/[your-project]/home)
     */
    this.defineProjectSettings = function(projectName, projectPassword, debugMode) {

        debugMode = typeof debugMode !== 'undefined' ? debugMode : false;

        this._projectName =      projectName;
        this._projectPassword =  projectPassword;
        this._debugMode =        debugMode;
    };



    this.save = function(varObj) {

        me = this;

        varObj = typeof varObj !== 'undefined' ? varObj : {};        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        if(varObj.externalReferenceString !== ""){
            varObj.external_reference_string = varObj.external_reference_string;
        }

        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success'); 
        varObj.dataType = Cosmos.Data.Traverse(varObj, 'dataType'); 
        varObj.cosmos_force = Cosmos.Data.Traverse(varObj, 'cosmos_force'); 

        if(varObj.dataType === ""){
            varObj.dataType = "json";
        }

        this._varObj = varObj;

        // adds all the relevant data objects to a dataObj
        var dataObj = {};
        for (var i=0, max=Cosmos.Config.ReferenceDataArray.length; i < max; i++) {
            var dataType = Cosmos.Config.ReferenceDataArray[i];
            var traversedData = Cosmos.Data.Traverse(varObj, dataType);
            //if(traversedData !== ""){
                dataObj[dataType] = traversedData;
            //}
        }
        dataObj.project_name = this._projectName;
        dataObj.project_password = this._projectPassword;
        dataObj.external_reference_string = varObj.external_reference_string;
        dataObj.cosmos_force = varObj.cosmos_force;

        var currentTime = new Date();
        dataObj.cacheBuster = currentTime.getTime()+"_"+Math.random();


        if(varObj.beforeSubmit !== ''){
            varObj.beforeSubmit(dataObj);
        }


        $.ajax({
            url: Cosmos.Config.ServiceUrl+"save/",
            data: dataObj,
            dataType: varObj.dataType,
            success: function(xhr) {
                if(varObj.success !== ''){
                    varObj.success(xhr);
                }
                if(me._debugMode) console.log(xhr);

                if(xhr.ErrorMessage){
                    alert(xhr.ErrorMessage);
                }
            }
        });

    };


    this.update = function(varObj) {

        me = this;

        varObj = typeof varObj !== 'undefined' ? varObj : {};        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        if(varObj.external_reference_string !== ""){
            varObj.external_reference_string = varObj.external_reference_string;
        }

        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success');  
        varObj.dataType = Cosmos.Data.Traverse(varObj, 'dataType'); 
        varObj.cosmos_force = Cosmos.Data.Traverse(varObj, 'cosmos_force'); 

        if(varObj.dataType === ""){
            varObj.dataType = "json";
        }

        this._varObj = varObj;

        // adds all the relevant data objects to a dataObj
        var dataObj = {};
        for (var i=0, max=Cosmos.Config.ReferenceDataArray.length; i < max; i++) {
            var dataType = Cosmos.Config.ReferenceDataArray[i];
            var traversedData = Cosmos.Data.Traverse(varObj, dataType);
            if(traversedData !== ""){
                dataObj[dataType] = traversedData;
            }
        }
        dataObj.project_name = this._projectName;
        dataObj.project_password = this._projectPassword;
        dataObj.external_reference_string = varObj.external_reference_string;
        dataObj.cosmos_force = varObj.cosmos_force;


        if(varObj.beforeSubmit !== ''){
            varObj.beforeSubmit(dataObj);
        }

        $.ajax({
            url: Cosmos.Config.ServiceUrl+"update/",
            data: dataObj,
            dataType: varObj.dataType,
            success: function(xhr) {
                if(varObj.success !== ''){
                    varObj.success(xhr);
                }
                if(me._debugMode) console.log(xhr);
            }
        });

    };


    this.deactivate = function(varObj) {
        this.activateOrDeactivate(varObj, "deactivate");
    };

    this.activate = function(varObj) {
        this.activateOrDeactivate(varObj, "activate");
    };



    this.del = function(varObj) {

        me = this;

        varObj = typeof varObj !== 'undefined' ? varObj : {};        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        if(varObj.external_reference_string !== ""){
            varObj.external_reference_string = varObj.external_reference_string;
        }

        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success');  
        varObj.dataType = Cosmos.Data.Traverse(varObj, 'dataType'); 
        varObj.cosmos_force = Cosmos.Data.Traverse(varObj, 'cosmos_force'); 

        if(varObj.dataType === ""){
            varObj.dataType = "json";
        }

        this._varObj = varObj;

        // adds all the relevant data objects to a dataObj
        var dataObj = {};
        for (var i=0, max=Cosmos.Config.ReferenceDataArray.length; i < max; i++) {
            var dataType = Cosmos.Config.ReferenceDataArray[i];
            var traversedData = Cosmos.Data.Traverse(varObj, dataType);
            if(traversedData !== ""){
                dataObj[dataType] = traversedData;
            }
        }
        dataObj.project_name = this._projectName;
        dataObj.project_password = this._projectPassword;
        dataObj.external_reference_string = varObj.external_reference_string;
        dataObj.cosmos_force = varObj.cosmos_force;


        if(varObj.beforeSubmit !== ''){
            varObj.beforeSubmit(dataObj);
        }


        $.ajax({
            url: Cosmos.Config.ServiceUrl+"delete/",
            data: dataObj,
            dataType: varObj.dataType,
            success: function(xhr) {
                if(varObj.success !== ''){
                    varObj.success(xhr);
                }
                if(me._debugMode) console.log(xhr);
            }
        });

    };




    this.activateOrDeactivate = function(varObj, varActivateOrDeactivate) {
        varObj = typeof varObj !== 'undefined' ? varObj : {};        
        
        varObj.external_reference_string = Cosmos.Data.Traverse(varObj, 'external_reference_string'); 
        if(varObj.external_reference_string !== ""){
            varObj.external_reference_string = varObj.external_reference_string;
        }

        varObj.beforeSubmit = Cosmos.Data.Traverse(varObj, 'beforeSubmit'); 
        varObj.success = Cosmos.Data.Traverse(varObj, 'success'); 
        varObj.dataType = Cosmos.Data.Traverse(varObj, 'dataType'); 

        if(varObj.dataType === ""){
            varObj.dataType = "json";
        }

        if(varObj.beforeSubmit !== ''){
            varObj.beforeSubmit(dataObj);
        }

        var dataObj = {};
        dataObj.project_name = this._projectName;
        dataObj.project_password = this._projectPassword;
        dataObj.external_reference_string = varObj.external_reference_string;

        $.ajax({
            url: Cosmos.Config.ServiceUrl+"service/"+varActivateOrDeactivate+"/",
            data: dataObj,
            dataType: varObj.dataType,
            success: function(xhr) {
                if(varObj.success !== ''){
                    varObj.success(xhr);
                }
                if(me._debugMode) console.log(xhr);
            }
        });
        
    }
};


















































































/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input'),
        isTextareaSupported = 'placeholder' in document.createElement('textarea'),
        prototype = $.fn,
        valHooks = $.valHooks,
        hooks,
        placeholder;

    if (isInputSupported && isTextareaSupported) {

        placeholder = prototype.placeholder = function() {
            return this;
        };

        placeholder.input = placeholder.textarea = true;

    } else {

        placeholder = prototype.placeholder = function() {
            var $this = this;
            $this
                .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
                .not('.placeholder')
                .bind({
                    'focus.placeholder': clearPlaceholder,
                    'blur.placeholder': setPlaceholder
                })
                .data('placeholder-enabled', true)
                .trigger('blur.placeholder');
            return $this;
        };

        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;

        hooks = {
            'get': function(element) {
                var $element = $(element);
                return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
            },
            'set': function(element, value) {
                var $element = $(element);
                if (!$element.data('placeholder-enabled')) {
                    return element.value = value;
                }
                if (value == '') {
                    element.value = value;
                    // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
                    if (element != document.activeElement) {
                        // We can't use `triggerHandler` here because of dummy text/password inputs :(
                        setPlaceholder.call(element);
                    }
                } else if ($element.hasClass('placeholder')) {
                    clearPlaceholder.call(element, true, value) || (element.value = value);
                } else {
                    element.value = value;
                }
                // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
                return $element;
            }
        };

        isInputSupported || (valHooks.input = hooks);
        isTextareaSupported || (valHooks.textarea = hooks);

        $(function() {
            // Look for forms
            $(document).delegate('form', 'submit.placeholder', function() {
                // Clear the placeholder values so they don't get submitted
                var $inputs = $('.placeholder', this).each(clearPlaceholder);
                setTimeout(function() {
                    $inputs.each(setPlaceholder);
                }, 10);
            });
        });

        // Clear placeholder values upon page reload
        $(window).bind('beforeunload.placeholder', function() {
            $('.placeholder').each(function() {
                this.value = '';
            });
        });

    }

    function args(elem) {
        // Return an object of element attributes
        var newAttrs = {},
            rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function(i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value;
            }
        });
        return newAttrs;
    }

    function clearPlaceholder(event, value) {
        var input = this,
            $input = $(input);
        if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
            if ($input.data('placeholder-password')) {
                $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
                // If `clearPlaceholder` was called from `$.valHooks.input.set`
                if (event === true) {
                    return $input[0].value = value;
                }
                $input.focus();
            } else {
                input.value = '';
                $input.removeClass('placeholder');
                input == document.activeElement && input.select();
            }
        }
    }

    function setPlaceholder() {
        var $replacement,
            input = this,
            $input = $(input),
            $origInput = $input,
            id = this.id;
        if (input.value == '') {
            if (input.type == 'password') {
                if (!$input.data('placeholder-textinput')) {
                    try {
                        $replacement = $input.clone().attr({ 'type': 'text' });
                    } catch(e) {
                        $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
                    }
                    $replacement
                        .removeAttr('name')
                        .data({
                            'placeholder-password': true,
                            'placeholder-id': id
                        })
                        .bind('focus.placeholder', clearPlaceholder);
                    $input
                        .data({
                            'placeholder-textinput': $replacement,
                            'placeholder-id': id
                        })
                        .before($replacement);
                }
                $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
                // Note: `$input[0] != input` now!
            }
            $input.addClass('placeholder');
            $input[0].value = $input.attr('placeholder');
        } else {
            $input.removeClass('placeholder');
        }
    }

}(this, document, jQuery));











/*
 * Style File - jQuery plugin for styling file input elements
 *  
 * Copyright (c) 2007-2008 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Based on work by Shaun Inman
 *   http://www.shauninman.com/archive/2007/09/10/styling_file_inputs_with_css_and_the_dom
 *
 * Revision: $Id: jquery.filestyle.js 303 2008-01-30 13:53:24Z tuupola $
 *
 */

(function($) {
    
    $.fn.filestyle = function(options) {
                
        /* TODO: This should not override CSS. */
        var settings = {
            width : 250
        };
                
        if(options) {
            $.extend(settings, options);
        };
                        
        return this.each(function() {
            
            var self = this;
            var wrapper = $("<div>")
                            .css({
                                "width": settings.imagewidth + "px",
                                "height": settings.imageheight + "px",
                                "background": "url(" + settings.image + ") 0 0 no-repeat",
                                "background-position": "right",
                                "display": "inline",
                                "position": "absolute",
                                "overflow": "hidden"
                            });
                            
            var filename = $('<input class="file">')
                             .addClass($(self).attr("class"))
                             .css({
                                 "display": "inline",
                                 "width": settings.width + "px"
                             });

            $(self).before(filename);
            $(self).wrap(wrapper);

            $(self).css({
                        "position": "relative",
                        "height": settings.imageheight + "px",
                        "width": settings.width + "px",
                        "display": "inline",
                        "cursor": "pointer",
                        "opacity": "0.0"
                    });

            $(self).addClass("upload-button");

            if ($.browser.mozilla) {
                if (/Win/.test(navigator.platform)) {
                    $(self).css("margin-left", "-142px");                    
                } else {
                    $(self).css("margin-left", "-168px");                    
                };
            } else {
                $(self).css("margin-left", settings.imagewidth - settings.width + "px");                
            };

            $(self).bind("change", function() {
                filename.val($(self).val());
            });
      
        });
        

    };
    
})(jQuery);


































/*!
 * jQuery Form Plugin
 * version: 3.18 (28-SEP-2012)
 * @requires jQuery v1.5 or later
 *
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses:
 *    http://malsup.github.com/mit-license.txt
 *    http://malsup.github.com/gpl-license-v2.txt
 */
/*global ActiveXObject alert */
;(function($) {
"use strict";

/*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are mutually exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
        $('#myForm').on('submit', function(e) {
            e.preventDefault(); // <-- important
            $(this).ajaxSubmit({
                target: '#output'
            });
        });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
        $('#myForm').ajaxForm({
            target: '#output'
        });
    });
    
    You can also use ajaxForm with delegation (requires jQuery v1.7+), so the
    form does not have to exist when you invoke ajaxForm:

    $('#myForm').ajaxForm({
        delegation: true,
        target: '#output'
    });
    
    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
*/

/**
 * Feature detection
 */
var feature = {};
feature.fileapi = $("<input type='file'/>").get(0).files !== undefined;
feature.formdata = window.FormData !== undefined;

/**
 * ajaxSubmit() provides a mechanism for immediately submitting
 * an HTML form using AJAX.
 */
$.fn.ajaxSubmit = function(options) {
    /*jshint scripturl:true */

    // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
    if (!this.length) {
        log('ajaxSubmit: skipping submit process - no element selected');
        return this;
    }
    
    var method, action, url, $form = this;

    if (typeof options == 'function') {
        options = { success: options };
    }

    method = this.attr('method');
    action = this.attr('action');
    url = (typeof action === 'string') ? $.trim(action) : '';
    url = url || window.location.href || '';
    if (url) {
        // clean url (don't include hash vaue)
        url = (url.match(/^([^#]+)/)||[])[1];
    }

    options = $.extend(true, {
        url:  url,
        success: $.ajaxSettings.success,
        type: method || 'GET',
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
    }, options);

    // hook for manipulating the form data before it is extracted;
    // convenient for use with rich editors like tinyMCE or FCKEditor
    var veto = {};
    this.trigger('form-pre-serialize', [this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
        return this;
    }

    // provide opportunity to alter form data before it is serialized
    if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSerialize callback');
        return this;
    }

    var traditional = options.traditional;
    if ( traditional === undefined ) {
        traditional = $.ajaxSettings.traditional;
    }
    
    var elements = [];
    var qx, a = this.formToArray(options.semantic, elements);
    if (options.data) {
        options.extraData = options.data;
        qx = $.param(options.data, traditional);
    }

    // give pre-submit callback an opportunity to abort the submit
    if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
        log('ajaxSubmit: submit aborted via beforeSubmit callback');
        return this;
    }

    // fire vetoable 'validate' event
    this.trigger('form-submit-validate', [a, this, options, veto]);
    if (veto.veto) {
        log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
        return this;
    }

    var q = $.param(a, traditional);
    if (qx) {
        q = ( q ? (q + '&' + qx) : qx );
    }    
    if (options.type.toUpperCase() == 'GET') {
        options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
        options.data = null;  // data is null for 'get'
    }
    else {
        options.data = q; // data is the query string for 'post'
    }

    var callbacks = [];
    if (options.resetForm) {
        callbacks.push(function() { $form.resetForm(); });
    }
    if (options.clearForm) {
        callbacks.push(function() { $form.clearForm(options.includeHidden); });
    }

    // perform a load on the target only if dataType is not provided
    if (!options.dataType && options.target) {
        var oldSuccess = options.success || function(){};
        callbacks.push(function(data) {
            var fn = options.replaceTarget ? 'replaceWith' : 'html';
            $(options.target)[fn](data).each(oldSuccess, arguments);
        });
    }
    else if (options.success) {
        callbacks.push(options.success);
    }

    options.success = function(data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
        var context = options.context || this ;    // jQuery 1.4+ supports scope context 
        for (var i=0, max=callbacks.length; i < max; i++) {
            callbacks[i].apply(context, [data, status, xhr || $form, $form]);
        }
    };

    // are there files to upload?
    var fileInputs = $('input:file:enabled[value]', this); // [value] (issue #113)
    var hasFileInputs = fileInputs.length > 0;
    var mp = 'multipart/form-data';
    var multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

    var fileAPI = feature.fileapi && feature.formdata;
    log("fileAPI :" + fileAPI);
    var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;

    var jqxhr;

    // options.iframe allows user to force iframe mode
    // 06-NOV-09: now defaulting to iframe mode if file input is detected
    if (options.iframe !== false && (options.iframe || shouldUseFrame)) {
        // hack to fix Safari hang (thanks to Tim Molendijk for this)
        // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
        if (options.closeKeepAlive) {
            $.get(options.closeKeepAlive, function() {
                jqxhr = fileUploadIframe(a);
            });
        }
        else {
            jqxhr = fileUploadIframe(a);
        }
    }
    else if ((hasFileInputs || multipart) && fileAPI) {
        jqxhr = fileUploadXhr(a);
    }
    else {
        jqxhr = $.ajax(options);
    }

    $form.removeData('jqxhr').data('jqxhr', jqxhr);

    // clear element array
    for (var k=0; k < elements.length; k++)
        elements[k] = null;

    // fire 'notify' event
    this.trigger('form-submit-notify', [this, options]);
    return this;

    // utility fn for deep serialization
    function deepSerialize(extraData){
        var serialized = $.param(extraData).split('&');
        var len = serialized.length;
        var result = {};
        var i, part;
        for (i=0; i < len; i++) {
            part = serialized[i].split('=');
            result[decodeURIComponent(part[0])] = decodeURIComponent(part[1]);
        }
        return result;
    }

     // XMLHttpRequest Level 2 file uploads (big hat tip to francois2metz)
    function fileUploadXhr(a) {
        var formdata = new FormData();

        for (var i=0; i < a.length; i++) {
            formdata.append(a[i].name, a[i].value);
        }

        if (options.extraData) {
            var serializedData = deepSerialize(options.extraData);
            for (var p in serializedData)
                if (serializedData.hasOwnProperty(p))
                    formdata.append(p, serializedData[p]);
        }

        options.data = null;

        var s = $.extend(true, {}, $.ajaxSettings, options, {
            contentType: false,
            processData: false,
            cache: false,
            type: method || 'POST'
        });
        
        if (options.uploadProgress) {
            // workaround because jqXHR does not expose upload property
            s.xhr = function() {
                var xhr = jQuery.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.onprogress = function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position; /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        options.uploadProgress(event, position, total, percent);
                    };
                }
                return xhr;
            };
        }

        s.data = null;
            var beforeSend = s.beforeSend;
            s.beforeSend = function(xhr, o) {
                o.data = formdata;
                if(beforeSend)
                    beforeSend.call(this, xhr, o);
        };
        return $.ajax(s);
    }

    // private function for handling file uploads (hat tip to YAHOO!)
    function fileUploadIframe(a) {
        var form = $form[0], el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
        var useProp = !!$.fn.prop;
        var deferred = $.Deferred();

        if ($(':input[name=submit],:input[id=submit]', form).length) {
            // if there is an input with a name or id of 'submit' then we won't be
            // able to invoke the submit fn on the form (at least not x-browser)
            alert('Error: Form elements must not have name or id of "submit".');
            deferred.reject();
            return deferred;
        }
        
        if (a) {
            // ensure that every serialized input is still enabled
            for (i=0; i < elements.length; i++) {
                el = $(elements[i]);
                if ( useProp )
                    el.prop('disabled', false);
                else
                    el.removeAttr('disabled');
            }
        }

        s = $.extend(true, {}, $.ajaxSettings, options);
        s.context = s.context || s;
        id = 'jqFormIO' + (new Date().getTime());
        if (s.iframeTarget) {
            $io = $(s.iframeTarget);
            n = $io.attr('name');
            if (!n)
                 $io.attr('name', id);
            else
                id = n;
        }
        else {
            $io = $('<iframe name="' + id + '" src="'+ s.iframeSrc +'" />');
            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });
        }
        io = $io[0];


        xhr = { // mock object
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: 'n/a',
            getAllResponseHeaders: function() {},
            getResponseHeader: function() {},
            setRequestHeader: function() {},
            abort: function(status) {
                var e = (status === 'timeout' ? 'timeout' : 'aborted');
                log('aborting upload... ' + e);
                this.aborted = 1;
                // #214
                if (io.contentWindow.document.execCommand) {
                    try { // #214
                        io.contentWindow.document.execCommand('Stop');
                    } catch(ignore) {}
                }
                $io.attr('src', s.iframeSrc); // abort op in progress
                xhr.error = e;
                if (s.error)
                    s.error.call(s.context, xhr, e, status);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, e]);
                if (s.complete)
                    s.complete.call(s.context, xhr, e);
            }
        };

        g = s.global;
        // trigger ajax global events so that activity/block indicators work like normal
        if (g && 0 === $.active++) {
            $.event.trigger("ajaxStart");
        }
        if (g) {
            $.event.trigger("ajaxSend", [xhr, s]);
        }

        if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
            if (s.global) {
                $.active--;
            }
            deferred.reject();
            return deferred;
        }
        if (xhr.aborted) {
            deferred.reject();
            return deferred;
        }

        // add submitting element to data if we know it
        sub = form.clk;
        if (sub) {
            n = sub.name;
            if (n && !sub.disabled) {
                s.extraData = s.extraData || {};
                s.extraData[n] = sub.value;
                if (sub.type == "image") {
                    s.extraData[n+'.x'] = form.clk_x;
                    s.extraData[n+'.y'] = form.clk_y;
                }
            }
        }
        
        var CLIENT_TIMEOUT_ABORT = 1;
        var SERVER_ABORT = 2;

        function getDoc(frame) {
            var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
            return doc;
        }
        
        // Rails CSRF hack (thanks to Yvan Barthelemy)
        var csrf_token = $('meta[name=csrf-token]').attr('content');
        var csrf_param = $('meta[name=csrf-param]').attr('content');
        if (csrf_param && csrf_token) {
            s.extraData = s.extraData || {};
            s.extraData[csrf_param] = csrf_token;
        }

        // take a breath so that pending repaints get some cpu time before the upload starts
        function doSubmit() {
            // make sure form attrs are set
            var t = $form.attr('target'), a = $form.attr('action');

            // update form attrs in IE friendly way
            form.setAttribute('target',id);
            if (!method) {
                form.setAttribute('method', 'POST');
            }
            if (a != s.url) {
                form.setAttribute('action', s.url);
            }

            // ie borks in some cases when setting encoding
            if (! s.skipEncodingOverride && (!method || /post/i.test(method))) {
                $form.attr({
                    encoding: 'multipart/form-data',
                    enctype:  'multipart/form-data'
                });
            }

            // support timout
            if (s.timeout) {
                timeoutHandle = setTimeout(function() { timedOut = true; cb(CLIENT_TIMEOUT_ABORT); }, s.timeout);
            }
            
            // look for server aborts
            function checkState() {
                try {
                    var state = getDoc(io).readyState;
                    log('state = ' + state);
                    if (state && state.toLowerCase() == 'uninitialized')
                        setTimeout(checkState,50);
                }
                catch(e) {
                    log('Server abort: ' , e, ' (', e.name, ')');
                    cb(SERVER_ABORT);
                    if (timeoutHandle)
                        clearTimeout(timeoutHandle);
                    timeoutHandle = undefined;
                }
            }

            // add "extra" data to form if provided in options
            var extraInputs = [];
            try {
                if (s.extraData) {
                    for (var n in s.extraData) {
                        if (s.extraData.hasOwnProperty(n)) {
                           // if using the $.param format that allows for multiple values with the same name
                           if($.isPlainObject(s.extraData[n]) && s.extraData[n].hasOwnProperty('name') && s.extraData[n].hasOwnProperty('value')) {
                               extraInputs.push(
                               $('<input type="hidden" name="'+s.extraData[n].name+'">').attr('value',s.extraData[n].value)
                                   .appendTo(form)[0]);
                           } else {
                               extraInputs.push(
                               $('<input type="hidden" name="'+n+'">').attr('value',s.extraData[n])
                                   .appendTo(form)[0]);
                           }
                        }
                    }
                }

                if (!s.iframeTarget) {
                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                    if (io.attachEvent)
                        io.attachEvent('onload', cb);
                    else
                        io.addEventListener('load', cb, false);
                }
                setTimeout(checkState,15);
                form.submit();
            }
            finally {
                // reset attrs and remove "extra" input elements
                form.setAttribute('action',a);
                if(t) {
                    form.setAttribute('target', t);
                } else {
                    $form.removeAttr('target');
                }
                $(extraInputs).remove();
            }
        }

        if (s.forceSync) {
            doSubmit();
        }
        else {
            setTimeout(doSubmit, 10); // this lets dom updates render
        }

        var data, doc, domCheckCount = 50, callbackProcessed;

        function cb(e) {
            if (xhr.aborted || callbackProcessed) {
                return;
            }
            try {
                doc = getDoc(io);
            }
            catch(ex) {
                log('cannot access response document: ', ex);
                e = SERVER_ABORT;
            }
            if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                xhr.abort('timeout');
                deferred.reject(xhr, 'timeout');
                return;
            }
            else if (e == SERVER_ABORT && xhr) {
                xhr.abort('server abort');
                deferred.reject(xhr, 'error', 'server abort');
                return;
            }

            if (!doc || doc.location.href == s.iframeSrc) {
                // response not received yet
                if (!timedOut)
                    return;
            }
            if (io.detachEvent)
                io.detachEvent('onload', cb);
            else    
                io.removeEventListener('load', cb, false);

            var status = 'success', errMsg;
            try {
                if (timedOut) {
                    throw 'timeout';
                }

                var isXml = s.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                log('isXml='+isXml);
                if (!isXml && window.opera && (doc.body === null || !doc.body.innerHTML)) {
                    if (--domCheckCount) {
                        // in some browsers (Opera) the iframe DOM is not always traversable when
                        // the onload callback fires, so we loop a bit to accommodate
                        log('requeing onLoad callback, DOM not available');
                        setTimeout(cb, 250);
                        return;
                    }
                    // let this fall through because server response could be an empty document
                    //log('Could not access iframe DOM after mutiple tries.');
                    //throw 'DOMException: not available';
                }

                //log('response detected');
                var docRoot = doc.body ? doc.body : doc.documentElement;
                xhr.responseText = docRoot ? docRoot.innerHTML : null;
                xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                if (isXml)
                    s.dataType = 'xml';
                xhr.getResponseHeader = function(header){
                    var headers = {'content-type': s.dataType};
                    return headers[header];
                };
                // support for XHR 'status' & 'statusText' emulation :
                if (docRoot) {
                    xhr.status = Number( docRoot.getAttribute('status') ) || xhr.status;
                    xhr.statusText = docRoot.getAttribute('statusText') || xhr.statusText;
                }

                var dt = (s.dataType || '').toLowerCase();
                var scr = /(json|script|text)/.test(dt);
                if (scr || s.textarea) {
                    // see if user embedded response in textarea
                    var ta = doc.getElementsByTagName('textarea')[0];
                    if (ta) {
                        xhr.responseText = ta.value;
                        // support for XHR 'status' & 'statusText' emulation :
                        xhr.status = Number( ta.getAttribute('status') ) || xhr.status;
                        xhr.statusText = ta.getAttribute('statusText') || xhr.statusText;
                    }
                    else if (scr) {
                        // account for browsers injecting pre around json response
                        var pre = doc.getElementsByTagName('pre')[0];
                        var b = doc.getElementsByTagName('body')[0];
                        if (pre) {
                            xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                        }
                        else if (b) {
                            xhr.responseText = b.textContent ? b.textContent : b.innerText;
                        }
                    }
                }
                else if (dt == 'xml' && !xhr.responseXML && xhr.responseText) {
                    xhr.responseXML = toXml(xhr.responseText);
                }

                try {
                    data = httpData(xhr, dt, s);
                }
                catch (e) {
                    status = 'parsererror';
                    xhr.error = errMsg = (e || status);
                }
            }
            catch (e) {
                log('error caught: ',e);
                status = 'error';
                xhr.error = errMsg = (e || status);
            }

            if (xhr.aborted) {
                log('upload aborted');
                status = null;
            }

            if (xhr.status) { // we've set xhr.status
                status = (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) ? 'success' : 'error';
            }

            // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
            if (status === 'success') {
                if (s.success)
                    s.success.call(s.context, data, 'success', xhr);
                deferred.resolve(xhr.responseText, 'success', xhr);
                if (g)
                    $.event.trigger("ajaxSuccess", [xhr, s]);
            }
            else if (status) {
                if (errMsg === undefined)
                    errMsg = xhr.statusText;
                if (s.error)
                    s.error.call(s.context, xhr, status, errMsg);
                deferred.reject(xhr, 'error', errMsg);
                if (g)
                    $.event.trigger("ajaxError", [xhr, s, errMsg]);
            }

            if (g)
                $.event.trigger("ajaxComplete", [xhr, s]);

            if (g && ! --$.active) {
                $.event.trigger("ajaxStop");
            }

            if (s.complete)
                s.complete.call(s.context, xhr, status);

            callbackProcessed = true;
            if (s.timeout)
                clearTimeout(timeoutHandle);

            // clean up
            setTimeout(function() {
                if (!s.iframeTarget)
                    $io.remove();
                xhr.responseXML = null;
            }, 100);
        }

        var toXml = $.parseXML || function(s, doc) { // use parseXML if available (jQuery 1.5+)
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(s);
            }
            else {
                doc = (new DOMParser()).parseFromString(s, 'text/xml');
            }
            return (doc && doc.documentElement && doc.documentElement.nodeName != 'parsererror') ? doc : null;
        };
        var parseJSON = $.parseJSON || function(s) {
            /*jslint evil:true */
            return window['eval']('(' + s + ')');
        };

        var httpData = function( xhr, type, s ) { // mostly lifted from jq1.4.4

            var ct = xhr.getResponseHeader('content-type') || '',
                xml = type === 'xml' || !type && ct.indexOf('xml') >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;

            if (xml && data.documentElement.nodeName === 'parsererror') {
                if ($.error)
                    $.error('parsererror');
            }
            if (s && s.dataFilter) {
                data = s.dataFilter(data, type);
            }
            if (typeof data === 'string') {
                if (type === 'json' || !type && ct.indexOf('json') >= 0) {
                    data = parseJSON(data);
                } else if (type === "script" || !type && ct.indexOf("javascript") >= 0) {
                    $.globalEval(data);
                }
            }
            return data;
        };

        return deferred;
    }
};

/**
 * ajaxForm() provides a mechanism for fully automating form submission.
 *
 * The advantages of using this method instead of ajaxSubmit() are:
 *
 * 1: This method will include coordinates for <input type="image" /> elements (if the element
 *    is used to submit the form).
 * 2. This method will include the submit element's name/value data (for the element that was
 *    used to submit the form).
 * 3. This method binds the submit() method to the form for you.
 *
 * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
 * passes the options argument along after properly binding events for submit elements and
 * the form itself.
 */
$.fn.ajaxForm = function(options) {
    options = options || {};
    options.delegation = options.delegation && $.isFunction($.fn.on);
    
    // in jQuery 1.3+ we can fix mistakes with the ready state
    if (!options.delegation && this.length === 0) {
        var o = { s: this.selector, c: this.context };
        if (!$.isReady && o.s) {
            log('DOM not ready, queuing ajaxForm');
            $(function() {
                $(o.s,o.c).ajaxForm(options);
            });
            return this;
        }
        // is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
        log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
        return this;
    }

    if ( options.delegation ) {
        $(document)
            .off('submit.form-plugin', this.selector, doAjaxSubmit)
            .off('click.form-plugin', this.selector, captureSubmittingElement)
            .on('submit.form-plugin', this.selector, options, doAjaxSubmit)
            .on('click.form-plugin', this.selector, options, captureSubmittingElement);
        return this;
    }

    return this.ajaxFormUnbind()
        .bind('submit.form-plugin', options, doAjaxSubmit)
        .bind('click.form-plugin', options, captureSubmittingElement);
};

// private event handlers    
function doAjaxSubmit(e) {
    /*jshint validthis:true */
    var options = e.data;
    if (!e.isDefaultPrevented()) { // if event has been canceled, don't proceed
        e.preventDefault();
        $(this).ajaxSubmit(options);
    }
}
    
function captureSubmittingElement(e) {
    /*jshint validthis:true */
    var target = e.target;
    var $el = $(target);
    if (!($el.is(":submit,input:image"))) {
        // is this a child element of the submit el?  (ex: a span within a button)
        var t = $el.closest(':submit');
        if (t.length === 0) {
            return;
        }
        target = t[0];
    }
    var form = this;
    form.clk = target;
    if (target.type == 'image') {
        if (e.offsetX !== undefined) {
            form.clk_x = e.offsetX;
            form.clk_y = e.offsetY;
        } else if (typeof $.fn.offset == 'function') {
            var offset = $el.offset();
            form.clk_x = e.pageX - offset.left;
            form.clk_y = e.pageY - offset.top;
        } else {
            form.clk_x = e.pageX - target.offsetLeft;
            form.clk_y = e.pageY - target.offsetTop;
        }
    }
    // clear form vars
    setTimeout(function() { form.clk = form.clk_x = form.clk_y = null; }, 100);
}


// ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
$.fn.ajaxFormUnbind = function() {
    return this.unbind('submit.form-plugin click.form-plugin');
};

/**
 * formToArray() gathers form element data into an array of objects that can
 * be passed to any of the following ajax functions: $.get, $.post, or load.
 * Each object in the array has both a 'name' and 'value' property.  An example of
 * an array for a simple login form might be:
 *
 * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
 *
 * It is this array that is passed to pre-submit callback functions provided to the
 * ajaxSubmit() and ajaxForm() methods.
 */
$.fn.formToArray = function(semantic, elements) {
    var a = [];
    if (this.length === 0) {
        return a;
    }

    var form = this[0];
    var els = semantic ? form.getElementsByTagName('*') : form.elements;
    if (!els) {
        return a;
    }

    var i,j,n,v,el,max,jmax;
    for(i=0, max=els.length; i < max; i++) {
        el = els[i];
        n = el.name;
        if (!n) {
            continue;
        }

        if (semantic && form.clk && el.type == "image") {
            // handle image inputs on the fly when semantic == true
            if(!el.disabled && form.clk == el) {
                a.push({name: n, value: $(el).val(), type: el.type });
                a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
            }
            continue;
        }

        v = $.fieldValue(el, true);
        if (v && v.constructor == Array) {
            if (elements) 
                elements.push(el);
            for(j=0, jmax=v.length; j < jmax; j++) {
                a.push({name: n, value: v[j]});
            }
        }
        else if (feature.fileapi && el.type == 'file' && !el.disabled) {
            if (elements) 
                elements.push(el);
            var files = el.files;
            if (files.length) {
                for (j=0; j < files.length; j++) {
                    a.push({name: n, value: files[j], type: el.type});
                }
            }
            else {
                // #180
                a.push({ name: n, value: '', type: el.type });
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            if (elements) 
                elements.push(el);
            a.push({name: n, value: v, type: el.type, required: el.required});
        }
    }

    if (!semantic && form.clk) {
        // input type=='image' are not found in elements array! handle it here
        var $input = $(form.clk), input = $input[0];
        n = input.name;
        if (n && !input.disabled && input.type == 'image') {
            a.push({name: n, value: $input.val()});
            a.push({name: n+'.x', value: form.clk_x}, {name: n+'.y', value: form.clk_y});
        }
    }
    return a;
};

/**
 * Serializes form data into a 'submittable' string. This method will return a string
 * in the format: name1=value1&amp;name2=value2
 */
$.fn.formSerialize = function(semantic) {
    //hand off to jQuery.param for proper encoding
    return $.param(this.formToArray(semantic));
};

/**
 * Serializes all field elements in the jQuery object into a query string.
 * This method will return a string in the format: name1=value1&amp;name2=value2
 */
$.fn.fieldSerialize = function(successful) {
    var a = [];
    this.each(function() {
        var n = this.name;
        if (!n) {
            return;
        }
        var v = $.fieldValue(this, successful);
        if (v && v.constructor == Array) {
            for (var i=0,max=v.length; i < max; i++) {
                a.push({name: n, value: v[i]});
            }
        }
        else if (v !== null && typeof v != 'undefined') {
            a.push({name: this.name, value: v});
        }
    });
    //hand off to jQuery.param for proper encoding
    return $.param(a);
};

/**
 * Returns the value(s) of the element in the matched set.  For example, consider the following form:
 *
 *  <form><fieldset>
 *      <input name="A" type="text" />
 *      <input name="A" type="text" />
 *      <input name="B" type="checkbox" value="B1" />
 *      <input name="B" type="checkbox" value="B2"/>
 *      <input name="C" type="radio" value="C1" />
 *      <input name="C" type="radio" value="C2" />
 *  </fieldset></form>
 *
 *  var v = $(':text').fieldValue();
 *  // if no values are entered into the text inputs
 *  v == ['','']
 *  // if values entered into the text inputs are 'foo' and 'bar'
 *  v == ['foo','bar']
 *
 *  var v = $(':checkbox').fieldValue();
 *  // if neither checkbox is checked
 *  v === undefined
 *  // if both checkboxes are checked
 *  v == ['B1', 'B2']
 *
 *  var v = $(':radio').fieldValue();
 *  // if neither radio is checked
 *  v === undefined
 *  // if first radio is checked
 *  v == ['C1']
 *
 * The successful argument controls whether or not the field element must be 'successful'
 * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
 * The default value of the successful argument is true.  If this value is false the value(s)
 * for each element is returned.
 *
 * Note: This method *always* returns an array.  If no valid value can be determined the
 *    array will be empty, otherwise it will contain one or more values.
 */
$.fn.fieldValue = function(successful) {
    for (var val=[], i=0, max=this.length; i < max; i++) {
        var el = this[i];
        var v = $.fieldValue(el, successful);
        if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length)) {
            continue;
        }
        if (v.constructor == Array)
            $.merge(val, v);
        else
            val.push(v);
    }
    return val;
};

/**
 * Returns the value of the field element.
 */
$.fieldValue = function(el, successful) {
    var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
    if (successful === undefined) {
        successful = true;
    }

    if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
        (t == 'checkbox' || t == 'radio') && !el.checked ||
        (t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
        tag == 'select' && el.selectedIndex == -1)) {
            return null;
    }

    if (tag == 'select') {
        var index = el.selectedIndex;
        if (index < 0) {
            return null;
        }
        var a = [], ops = el.options;
        var one = (t == 'select-one');
        var max = (one ? index+1 : ops.length);
        for(var i=(one ? index : 0); i < max; i++) {
            var op = ops[i];
            if (op.selected) {
                var v = op.value;
                if (!v) { // extra pain for IE...
                    v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                }
                if (one) {
                    return v;
                }
                a.push(v);
            }
        }
        return a;
    }
    return $(el).val();
};

/**
 * Clears the form data.  Takes the following actions on the form's input fields:
 *  - input text fields will have their 'value' property set to the empty string
 *  - select elements will have their 'selectedIndex' property set to -1
 *  - checkbox and radio inputs will have their 'checked' property set to false
 *  - inputs of type submit, button, reset, and hidden will *not* be effected
 *  - button elements will *not* be effected
 */
$.fn.clearForm = function(includeHidden) {
    return this.each(function() {
        $('input,select,textarea', this).clearFields(includeHidden);
    });
};

/**
 * Clears the selected form elements.
 */
$.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
    var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; // 'hidden' is not in this list
    return this.each(function() {
        var t = this.type, tag = this.tagName.toLowerCase();
        if (re.test(t) || tag == 'textarea') {
            this.value = '';
        }
        else if (t == 'checkbox' || t == 'radio') {
            this.checked = false;
        }
        else if (tag == 'select') {
            this.selectedIndex = -1;
        }
        else if (includeHidden) {
            // includeHidden can be the value true, or it can be a selector string
            // indicating a special test; for example:
            //  $('#myForm').clearForm('.special:hidden')
            // the above would clean hidden inputs that have the class of 'special'
            if ( (includeHidden === true && /hidden/.test(t)) ||
                 (typeof includeHidden == 'string' && $(this).is(includeHidden)) )
                this.value = '';
        }
    });
};

/**
 * Resets the form data.  Causes all form elements to be reset to their original value.
 */
$.fn.resetForm = function() {
    return this.each(function() {
        // guard against an input with the name of 'reset'
        // note that IE reports the reset function as an 'object'
        if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType)) {
            this.reset();
        }
    });
};

/**
 * Enables or disables any matching elements.
 */
$.fn.enable = function(b) {
    if (b === undefined) {
        b = true;
    }
    return this.each(function() {
        this.disabled = !b;
    });
};

/**
 * Checks/unchecks any matching checkboxes or radio buttons and
 * selects/deselects and matching option elements.
 */
$.fn.selected = function(select) {
    if (select === undefined) {
        select = true;
    }
    return this.each(function() {
        var t = this.type;
        if (t == 'checkbox' || t == 'radio') {
            this.checked = select;
        }
        else if (this.tagName.toLowerCase() == 'option') {
            var $sel = $(this).parent('select');
            if (select && $sel[0] && $sel[0].type == 'select-one') {
                // deselect all other options
                $sel.find('option').selected(false);
            }
            this.selected = select;
        }
    });
};

// expose debug var
$.fn.ajaxSubmit.debug = false;

// helper fn for console logging
function log() {
    if (!$.fn.ajaxSubmit.debug) 
        return;
    var msg = '[jquery.form] ' + Array.prototype.join.call(arguments,'');
    if (window.console && window.console.log) {
        window.console.log(msg);
    }
    else if (window.opera && window.opera.postError) {
        window.opera.postError(msg);
    }
}

})(jQuery);
    