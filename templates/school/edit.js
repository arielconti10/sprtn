// $(document).ready(function(){
//     var school_types = listRecord("http://hapi.spartan.ftd.com.br/api/schooltype");
//     var sectors = listRecord("http://hapi.spartan.ftd.com.br/api/sector");
//     var subsidiaries = listRecord("http://hapi.spartan.ftd.com.br/api/subsidiary");
//     var states = listRecord("http://hapi.spartan.ftd.com.br/api/state");
//     var chains = listRecord("http://hapi.spartan.ftd.com.br/api/chain");
//     var congregations = listRecord("http://hapi.spartan.ftd.com.br/api/congregation");
//     var localizations = listRecord("http://hapi.spartan.ftd.com.br/api/localization");
//     var profiles = listRecord("http://hapi.spartan.ftd.com.br/api/profile");

//     //json a ser enviado para o mustache
//     var params_mustache = {
//         "school_types" : school_types.data,
//         "sectors" : sectors.data,
//         "subsidiaries" : subsidiaries.data,
//         "states" : states.data,
//         "chains" : chains.data,
//         "congregations" : congregations.data,
//         "localizations" : localizations.data,
//         "profiles" : profiles.data
//     };

//     console.log(params_mustache);
//     renderMustache("templates/school/edit.html", params_mustache);



// });