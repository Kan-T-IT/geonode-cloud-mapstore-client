<!-- -----------------------------------------------------------------
-
- Copyright (C) 2019 OSGeo
-
- This program is free software: you can redistribute it and/or modify
- it under the terms of the GNU General Public License as published by
- the Free Software Foundation, either version 3 of the License, or
- (at your option) any later version.
-
- This program is distributed in the hope that it will be useful,
- but WITHOUT ANY WARRANTY; without even the implied warranty of
- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
- GNU General Public License for more details.
-
- You should have received a copy of the GNU General Public License
- along with this program. If not, see <http://www.gnu.org/licenses/>.
-
---------------------------------------------------------------------- -->






<!DOCTYPE html>
<html lang="en" class="msgapi">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta Http-Equiv="Cache-Control" Content="no-cache">
    <meta Http-Equiv="Pragma" Content="no-cache">
    <meta Http-Equiv="Expires" Content="0">
    <meta Http-Equiv="Pragma-directive: no-cache">
    <meta Http-Equiv="Cache-directive: no-cache">

    <title>example.com</title>

    <link rel="shortcut icon" href="/static/geonode/img/favicon.ico" />
    <link href="/static/lib/css/ol.css" rel="stylesheet" />
    <script src="/static/lib/js/ol.js"></script>
    <link rel="preload" as="style" href="/static/geonode/css/font-awesome.min.css" />
    <link rel="preload" as="font" href="/static/geonode/fonts/lato_regular.ttf" crossorigin="" />
    <link rel="preload" as="font" href="/static/geonode/fonts/lato_bold.ttf" crossorigin="" />
    <link rel="preload" as="font" href="/static/geonode/fonts/lato_light.ttf" crossorigin="" />

    

      
      <link href="/static/lib/css/assets.min.css" rel="stylesheet"/>
      
      <link href="/static/geonode/css/base.css" rel="stylesheet"/>
      <link rel='stylesheet' id='cookie-law-info-css'  href="/static/geonode/css/cookie-law-info/cookie-law-info-public.css" type='text/css' media='all' />
      <link rel='stylesheet' id='cookie-law-info-gdpr-css'  href="/static/geonode/css/cookie-law-info/cookie-law-info-gdpr.css" type='text/css' media='all' />
      <style type="text/css">[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}</style>
      <style type="text/css">
        

        

        

        

        

        
      </style>
      
    <link href="/static/fonts/montserrat.css" rel="stylesheet">
    <link href="/static/mapstore/dist/themes/geonode.css?geonode-mapstore-client-v4.0.0-d7bc021d5ebf97297e90c45214159c7a7143374b" rel="stylesheet" />
    <link href="/static/lib/css/bootstrap-select.css?geonode-mapstore-client-v4.0.0-d7bc021d5ebf97297e90c45214159c7a7143374b" rel="stylesheet" />
    
<style>
    
        
    
</style>

    


    

    
    <!--[if IE]>
      <script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>
      <style>
        #ieflag{
            display: block !important;
            height: 150px;
            text-align: center;
        }
      </style>
    <![endif]-->
    <link rel="search" type="application/opensearchdescription+xml" href="https://geoexpress-qa.kan.com.ar/catalogue/opensearch" title="GeoNode Search"/>

    <script>
        var siteUrl = 'https://geoexpress-qa.kan.com.ar/'.replace(/\/?$/, '/');
        var staticUrl = '/static/';
    </script>

    <!-- Autocomplete script for input boxes -->
    <script src="/static/geonode/js/search/autocomplete.js"></script>

    <script type="text/javascript">
      function thumbnailFeedbacks(data, status) {
        try {
          $("#_thumbnail_feedbacks").find('.modal-title').text(status);
          $("#_thumbnail_feedbacks").find('.modal-body').text(data);
          $("#_thumbnail_feedbacks").modal("show");
        } catch (err) {
          console.log(err);
        } finally {
          return true;
        }
      }
    </script>

    <!-- RTL styles -->
    
    
  </head>

  <body class=" gn-legacy gn-theme gn-desktop">
    <!-- Loading Mask -->
    <div class='lmask'></div>
    <!-- Navbar -->
    

<header class="gn-main-header">
    







<style>
    #gn-brand-navbar-bottom {
        display: none;
        margin-bottom: 0;
    }
    @media (max-width: 748px) {
        #gn-brand-navbar .gn-menu-content-center > * {
            display: none;
        }
        #gn-brand-navbar-bottom {
            display: flex;
            width: calc(100% - 16px);
            margin: 8px;
        }
    }
</style>

<nav id="gn-brand-navbar" class="gn-menu gn-menu-symmetric">
    <div class="gn-menu-container">
        <div class="gn-menu-content">
            <div class="gn-menu-content-left">
                
                <ul class="gn-menu-list">
                    <li>
                        <a href="/catalogue/#">
                            
                                <img src="/static/mapstore/img/geonode-logo.svg">
                            
                        </a>
                    </li>
                </ul>
                
            </div>
            <div class="gn-menu-content-center">
                
                    <div id="gn-search-bar" class="gn-search-bar">
    <div class="input-group">
        <div class="input-group-prepend">
            <button id="gn-search-bar-clear" type="button" class="btn btn-default" style="display: none;">
                <i class="fa fa-times"></i>
            </button>
            <button id="gn-search-bar-apply" type="button" class="btn btn-default">
                <i class="fa fa-search"></i>
            </button>
        </div>

        <input
            placeholder="Search"
            class="form-control" value=""
            style="outline: none; box-shadow: none;"
        >
        <div class="input-group-append">
            <div id="gn-search-bar-loading" class="gn-spinner" style="visibility: hidden;"><div></div></div>
        </div>
    </div>
    <div class="gn-suggestions" style="display: none;">
        <div class="gn-suggestions-header">
            <button id="gn-search-bar-clear-suggestions" type="button" class="btn btn-default">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="list-group">
        </div>
    </div>
</div>

<script>
    (function() {
        window.addEventListener('DOMContentLoaded', function() {

            const debounceTime = 300;
            const scrollOffset = 200;
            const pageSize = 10;
            const searchInput = document.querySelector('#gn-search-bar input');
            const suggestionsPanel = document.querySelector('#gn-search-bar .gn-suggestions');
            const suggestionsPanelList = document.querySelector('#gn-search-bar .gn-suggestions .list-group');

            const searchClear = document.querySelector('#gn-search-bar-clear');
            const searchClearSuggestions = document.querySelector('#gn-search-bar-clear-suggestions');
            const searchApply = document.querySelector('#gn-search-bar-apply');
            const searchLoading = document.querySelector('#gn-search-bar-loading');

            var request = null;
            var timeout = null;
            var value = '';
            var page = 1;
            var total = 0;
            var suggestions = [];
            var loading = false;

            searchLoading.style.visibility = 'hidden';

            function clearRequest() {
                if (request && request.abort) {
                    request.abort();
                    request = null;
                }
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            }

            function renderSuggestions() {
                suggestionsPanel.style.display = suggestions.length === 0 ? 'none' : 'block';
                suggestionsPanelList.innerHTML = '';
                for (var i = 0; i < suggestions.length; i++) {
                    const button = document.createElement('button');
                    button._gnSuggestion = suggestions[i];
                    button.innerHTML = suggestions[i].title;
                    button.setAttribute('class', 'list-group-item list-group-item-action');
                    button.onclick = function(event) {
                        onSearch(event.target._gnSuggestion && event.target._gnSuggestion.title);
                    }
                    suggestionsPanelList.appendChild(button);
                }
            }

            function getQParamFromHash() {
                const hash = window.location.hash || '';
                const splitHash = hash.split('?') || [];
                const queryHash = splitHash[1] || '';
                const params = queryHash.split('&');
                var q = '';
                for (var i = 0; i < params.length; i++) {
                    if (params[i].indexOf('q=') === 0) {
                        q = params[i].replace('q=', '');
                    }
                }
                return decodeURIComponent(q);
            }

            function onSearch(q) {
                const hash = window.location.hash || '';
                const splitHash = hash.split('?') || [];
                const queryHash = splitHash[1] || '';
                const params = queryHash.split('&');
                var newParams = q ? ['q=' + q] : []; 
                for (var i = 0; i < params.length; i++) {
                    if (params[i] && params[i].indexOf('q=') !== 0) {
                        newParams.push(params[i]);
                    }
                }

                const newQueryHash = newParams.join('&');

                location.href = '/catalogue/#/search' + (newQueryHash ? '?' + newQueryHash : '');

                clearRequest();
                suggestions = [];
                renderSuggestions();
                searchLoading.style.visibility = 'hidden';
            }

            function getSuggestions(options) {
                clearRequest();
                loading = true;
                searchLoading.style.visibility = 'visible';
                timeout = setTimeout(function() {
                    const url = '/api/v2/resources' +
                    '?page=' + options.page +
                    '&search=' + options.value +
                    '&search_fields=title' +
                    '&search_fields=abstract' +
                    '&filter{metadata_only}=false';
                    request = $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        success: function(response) {
                            options.resolve(response);
                            request = null;
                            timeout = null;
                            loading = false;
                            searchLoading.style.visibility = 'hidden';
                        },
                        error: function(response) {
                            options.resolve({
                                resources: [],
                                total: 0
                            });
                            request = null;
                            timeout = null;
                            loading = false;
                            searchLoading.style.visibility = 'hidden';
                        },
                    });
                }, options.debounceTime || 0);
            }

            searchInput.addEventListener('input', function(event) {
                page = 1;
                total = 0;
                value = event.target.value;
                if (!value) {
                    clearRequest();
                    suggestions = [];
                    loading = false;
                    searchLoading.style.visibility = 'hidden';
                    return renderSuggestions();
                }
                return getSuggestions({
                    value: value,
                    page: page,
                    pageSize: pageSize,
                    debounceTime: debounceTime,
                    resolve: function(response) {
                        suggestions = response && response.resources || [];
                        total = response.total;
                        renderSuggestions();
                    }
                });
            });

            suggestionsPanelList.addEventListener('scroll', function() {
                const scrollTop = suggestionsPanelList.scrollTop;
                const clientHeight = suggestionsPanelList.clientHeight;
                const scrollHeight = suggestionsPanelList.scrollHeight;
                const isScrolled = scrollTop + clientHeight >= scrollHeight - scrollOffset;
                if (isScrolled && suggestions.length < total && !loading) {
                    page = page + 1;
                    return getSuggestions({
                        value: value,
                        page: page,
                        pageSize: pageSize,
                        debounceTime: debounceTime,
                        resolve: function(response) {
                            const newSuggestions = response && response.resources || [];
                            suggestions = [...suggestions, ...newSuggestions];
                            renderSuggestions();
                        }
                    });
                }
            });

            function hashChange() {
                if (window.location.pathname.replace(/\//g, '') === 'catalogue') {
                    const newQParam = getQParamFromHash();
                    if (!value || newQParam !== value) {
                        searchInput.value = newQParam;
                        value = newQParam;
                    }
                    searchClear.style.display = newQParam ? 'block' : 'none';
                }
            }

            window.addEventListener('hashchange', hashChange, false);
            hashChange();


            searchClear.addEventListener('click', function() {
                onSearch('');
            });

            searchClearSuggestions.addEventListener('click', function() {
                suggestions = [];
                renderSuggestions();
            });
            searchApply.addEventListener('click', function() {
                if (value) {
                    onSearch(value);
                }
            });

            searchInput.addEventListener('keyup', function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();

                    onSearch(value);

                }
            });

        });
    })();
</script>
                
            </div>
            <div class="gn-menu-content-right">
                
                <ul class="gn-menu-list">
                    
                        


                    
                        

    
        <li>
            <a
                id=sign-in
                href="/account/login/?next=/"
                target=""
                class="nav-link btn btn-default"
            >
                Sign in
            </a>
        </li>
    
    
    


                    
                </ul>
                
            </div>
        </div>
    </div>
</nav>
<div id="gn-brand-navbar-bottom">
    
        <div id="gn-search-bar-bottom" class="gn-search-bar">
    <div class="input-group">
        <div class="input-group-prepend">
            <button id="gn-search-bar-bottom-clear" type="button" class="btn btn-default" style="display: none;">
                <i class="fa fa-times"></i>
            </button>
            <button id="gn-search-bar-bottom-apply" type="button" class="btn btn-default">
                <i class="fa fa-search"></i>
            </button>
        </div>

        <input
            placeholder="Search"
            class="form-control" value=""
            style="outline: none; box-shadow: none;"
        >
        <div class="input-group-append">
            <div id="gn-search-bar-bottom-loading" class="gn-spinner" style="visibility: hidden;"><div></div></div>
        </div>
    </div>
    <div class="gn-suggestions" style="display: none;">
        <div class="gn-suggestions-header">
            <button id="gn-search-bar-bottom-clear-suggestions" type="button" class="btn btn-default">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div class="list-group">
        </div>
    </div>
</div>

<script>
    (function() {
        window.addEventListener('DOMContentLoaded', function() {

            const debounceTime = 300;
            const scrollOffset = 200;
            const pageSize = 10;
            const searchInput = document.querySelector('#gn-search-bar-bottom input');
            const suggestionsPanel = document.querySelector('#gn-search-bar-bottom .gn-suggestions');
            const suggestionsPanelList = document.querySelector('#gn-search-bar-bottom .gn-suggestions .list-group');

            const searchClear = document.querySelector('#gn-search-bar-bottom-clear');
            const searchClearSuggestions = document.querySelector('#gn-search-bar-bottom-clear-suggestions');
            const searchApply = document.querySelector('#gn-search-bar-bottom-apply');
            const searchLoading = document.querySelector('#gn-search-bar-bottom-loading');

            var request = null;
            var timeout = null;
            var value = '';
            var page = 1;
            var total = 0;
            var suggestions = [];
            var loading = false;

            searchLoading.style.visibility = 'hidden';

            function clearRequest() {
                if (request && request.abort) {
                    request.abort();
                    request = null;
                }
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            }

            function renderSuggestions() {
                suggestionsPanel.style.display = suggestions.length === 0 ? 'none' : 'block';
                suggestionsPanelList.innerHTML = '';
                for (var i = 0; i < suggestions.length; i++) {
                    const button = document.createElement('button');
                    button._gnSuggestion = suggestions[i];
                    button.innerHTML = suggestions[i].title;
                    button.setAttribute('class', 'list-group-item list-group-item-action');
                    button.onclick = function(event) {
                        onSearch(event.target._gnSuggestion && event.target._gnSuggestion.title);
                    }
                    suggestionsPanelList.appendChild(button);
                }
            }

            function getQParamFromHash() {
                const hash = window.location.hash || '';
                const splitHash = hash.split('?') || [];
                const queryHash = splitHash[1] || '';
                const params = queryHash.split('&');
                var q = '';
                for (var i = 0; i < params.length; i++) {
                    if (params[i].indexOf('q=') === 0) {
                        q = params[i].replace('q=', '');
                    }
                }
                return decodeURIComponent(q);
            }

            function onSearch(q) {
                const hash = window.location.hash || '';
                const splitHash = hash.split('?') || [];
                const queryHash = splitHash[1] || '';
                const params = queryHash.split('&');
                var newParams = q ? ['q=' + q] : []; 
                for (var i = 0; i < params.length; i++) {
                    if (params[i] && params[i].indexOf('q=') !== 0) {
                        newParams.push(params[i]);
                    }
                }

                const newQueryHash = newParams.join('&');

                location.href = '/catalogue/#/search' + (newQueryHash ? '?' + newQueryHash : '');

                clearRequest();
                suggestions = [];
                renderSuggestions();
                searchLoading.style.visibility = 'hidden';
            }

            function getSuggestions(options) {
                clearRequest();
                loading = true;
                searchLoading.style.visibility = 'visible';
                timeout = setTimeout(function() {
                    const url = '/api/v2/resources' +
                    '?page=' + options.page +
                    '&search=' + options.value +
                    '&search_fields=title' +
                    '&search_fields=abstract' +
                    '&filter{metadata_only}=false';
                    request = $.ajax({
                        url: url,
                        type: 'GET',
                        dataType: 'json',
                        success: function(response) {
                            options.resolve(response);
                            request = null;
                            timeout = null;
                            loading = false;
                            searchLoading.style.visibility = 'hidden';
                        },
                        error: function(response) {
                            options.resolve({
                                resources: [],
                                total: 0
                            });
                            request = null;
                            timeout = null;
                            loading = false;
                            searchLoading.style.visibility = 'hidden';
                        },
                    });
                }, options.debounceTime || 0);
            }

            searchInput.addEventListener('input', function(event) {
                page = 1;
                total = 0;
                value = event.target.value;
                if (!value) {
                    clearRequest();
                    suggestions = [];
                    loading = false;
                    searchLoading.style.visibility = 'hidden';
                    return renderSuggestions();
                }
                return getSuggestions({
                    value: value,
                    page: page,
                    pageSize: pageSize,
                    debounceTime: debounceTime,
                    resolve: function(response) {
                        suggestions = response && response.resources || [];
                        total = response.total;
                        renderSuggestions();
                    }
                });
            });

            suggestionsPanelList.addEventListener('scroll', function() {
                const scrollTop = suggestionsPanelList.scrollTop;
                const clientHeight = suggestionsPanelList.clientHeight;
                const scrollHeight = suggestionsPanelList.scrollHeight;
                const isScrolled = scrollTop + clientHeight >= scrollHeight - scrollOffset;
                if (isScrolled && suggestions.length < total && !loading) {
                    page = page + 1;
                    return getSuggestions({
                        value: value,
                        page: page,
                        pageSize: pageSize,
                        debounceTime: debounceTime,
                        resolve: function(response) {
                            const newSuggestions = response && response.resources || [];
                            suggestions = [...suggestions, ...newSuggestions];
                            renderSuggestions();
                        }
                    });
                }
            });

            function hashChange() {
                if (window.location.pathname.replace(/\//g, '') === 'catalogue') {
                    const newQParam = getQParamFromHash();
                    if (!value || newQParam !== value) {
                        searchInput.value = newQParam;
                        value = newQParam;
                    }
                    searchClear.style.display = newQParam ? 'block' : 'none';
                }
            }

            window.addEventListener('hashchange', hashChange, false);
            hashChange();


            searchClear.addEventListener('click', function() {
                onSearch('');
            });

            searchClearSuggestions.addEventListener('click', function() {
                suggestions = [];
                renderSuggestions();
            });
            searchApply.addEventListener('click', function() {
                if (value) {
                    onSearch(value);
                }
            });

            searchInput.addEventListener('keyup', function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();

                    onSearch(value);

                }
            });

        });
    })();
</script>
    
</div>

    <script type="text/javascript">
        (function() {
            function manageUrlChange() {
                var signInElement = document.getElementById("sign-in");
                if (signInElement){
                    if (window.location.pathname === '/account/login/'){
                        signInElement.setAttribute("href", window.location.href)
                    }
                    else {
                        var href = signInElement.getAttribute("href").split("next=")[0];
                        var url_parts = window.location.href.split(window.location.pathname);
                        var path_name = encodeURIComponent(window.location.pathname + url_parts[url_parts.length-1]);
                        signInElement.setAttribute("href", href.concat("next=".concat(path_name)));
                    }
                }
            }
            window.addEventListener('DOMContentLoaded', manageUrlChange);
            window.addEventListener('hashchange', manageUrlChange, false);
        })();
    </script>

</header>
<div class="gn-main-header-placeholder"></div>









<nav id="gn-topbar" class="gn-menu gn-primary" data-gn-menu-resize="true">
    <div class="gn-menu-container">
        <div class="gn-menu-content">
            <div class="gn-menu-content-side gn-menu-content-left">
                
                <div class="dropdown">
                    <button
                        class="btn btn-primary dropdown-toggle"
                        type="button"
                        id="gn-topbar-small-menu"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="true"
                    >
                        <i class="fa fa-bars"> </i>
                    </button>
                    <ul
                        class="dropdown-menu"
                        aria-labelledby="gn-topbar-small-menu"
                    >
                        
                            

    
    
        <li class="dropdown-header"><strong>Data</strong></li>
        
            
                <li>
                    <a
                        href="/catalogue/#/search/?f=dataset"
                        target=""
                    >
                        Datasets
                        
                    </a>
                </li>
            
        
            
                <li>
                    <a
                        href="/catalogue/#/search/?f=document"
                        target=""
                    >
                        Documents
                        
                    </a>
                </li>
            
        
        
            <li role="separator" class="divider"></li>
        
    


                        
                            

    
        <li>
            <a
                href="/catalogue/#/search/?f=map"
                target=""
            >
                Maps
            </a>
        </li>
    
    


                        
                            

    
        <li>
            <a
                href="/catalogue/#/search/?f=geostory"
                target=""
            >
                GeoStories
            </a>
        </li>
    
    


                        
                            

    
        <li>
            <a
                href="/catalogue/#/search/?f=dashboard"
                target=""
            >
                Dashboards
            </a>
        </li>
    
    


                        
                            

    
        <li>
            <a
                href="/catalogue/#/search/?f=featured"
                target=""
            >
                Featured
            </a>
        </li>
    
    


                        
                        
                        
                            

    
    
        <li class="dropdown-header"><strong>Geoprocesos</strong></li>
        
            
                <li>
                    <a
                        href="/catalogue/#/addGeoprocess"
                        target=""
                    >
                        Add Geoprocesos
                        
                    </a>
                </li>
            
        
            
                <li>
                    <a
                        href="/catalogue/#/gpState"
                        target=""
                    >
                        Status Geoprocesos
                        
                    </a>
                </li>
            
        
        
    


                        

                    </ul>
                </div>
                <ul class="gn-menu-list">
                    
                        

    
    
    
        <li>
            <div class="dropdown ">
                <button
                    id=""
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    type="button"
                    class="dropdown-toggle btn btn-primary"
                    data-toggle="dropdown"
                >
                    
                        Data
                    
                    
                </button>
                <ul class="dropdown-menu" aria-labelledby="">
                    
                        
                            <li>
                                <a
                                    href="/catalogue/#/search/?f=dataset"
                                    target=""
                                >
                                    Datasets
                                    
                                </a>
                            </li>
                        
                        
                    
                        
                            <li>
                                <a
                                    href="/catalogue/#/search/?f=document"
                                    target=""
                                >
                                    Documents
                                    
                                </a>
                            </li>
                        
                        
                    
                </ul>
            </div>
        </li>
    


                    
                        

    
        <li>
            <a
                id=maps
                href="/catalogue/#/search/?f=map"
                target=""
                class="nav-link btn btn-primary"
            >
                Maps
            </a>
        </li>
    
    
    


                    
                        

    
        <li>
            <a
                id=geostories
                href="/catalogue/#/search/?f=geostory"
                target=""
                class="nav-link btn btn-primary"
            >
                GeoStories
            </a>
        </li>
    
    
    


                    
                        

    
        <li>
            <a
                id=dashboards
                href="/catalogue/#/search/?f=dashboard"
                target=""
                class="nav-link btn btn-primary"
            >
                Dashboards
            </a>
        </li>
    
    
    


                    
                        

    
        <li>
            <a
                id=featured
                href="/catalogue/#/search/?f=featured"
                target=""
                class="nav-link btn btn-primary"
            >
                Featured
            </a>
        </li>
    
    
    


                    
                    
                    
                        

    
    
    
        <li>
            <div class="dropdown ">
                <button
                    id=""
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    type="button"
                    class="dropdown-toggle btn btn-primary"
                    data-toggle="dropdown"
                >
                    
                        Geoprocesos
                    
                    
                </button>
                <ul class="dropdown-menu" aria-labelledby="">
                    
                        
                            <li>
                                <a
                                    href="/catalogue/#/addGeoprocess"
                                    target=""
                                >
                                    Add Geoprocesos
                                    
                                </a>
                            </li>
                        
                        
                    
                        
                            <li>
                                <a
                                    href="/catalogue/#/gpState"
                                    target=""
                                >
                                    Status Geoprocesos
                                    
                                </a>
                            </li>
                        
                        
                    
                </ul>
            </div>
        </li>
    


                    
                </ul>
                
            </div>
            <div class="gn-menu-content-center">
                
                
            </div>
            <div class="gn-menu-content-right">
                
                <ul class="gn-menu-list">
                    
                        

    
        <li>
            <a
                id=home
                href="/"
                target=""
                class="nav-link btn btn-primary"
            >
                Home
            </a>
        </li>
    
    
    


                    
                        

    
    
    
        <li>
            <div class="dropdown ">
                <button
                    id=""
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    type="button"
                    class="dropdown-toggle btn btn-primary"
                    data-toggle="dropdown"
                >
                    
                        About
                    
                    
                </button>
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="">
                    
                        
                            <li>
                                <a
                                    href="/people/"
                                    target=""
                                >
                                    People
                                    
                                </a>
                            </li>
                        
                        
                    
                        
                            <li>
                                <a
                                    href="/groups/"
                                    target=""
                                >
                                    Groups
                                    
                                </a>
                            </li>
                        
                        
                    
                </ul>
            </div>
        </li>
    


                    
                    

                    
                        




<form id="gn-language-selector-form" action="/i18n/setlang/" method="post" style="display:none;">
    <input type="hidden" name="csrfmiddlewaretoken" value="fIdka76Q6LaTOsCQUywzCumNVGBwp57Q58h9igXasyYu5J3yrzy5kt9J9gx6PFsg">
    <input name="language" type="hidden" value="en-us"/>
    <input name="next" type="hidden" value=""/>
</form>

    

        <li class="gn-language-selector">
            
            <div class="dropdown" id="gn-language-selector-dropdown">
                <button
                    id="gn-language-selector"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    type="button"
                    class="dropdown-toggle btn btn-primary"
                    data-toggle="dropdown"
                >
                    English
                </button>
                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="gn-language-selector">
                    
                         
                            <li>
                                <a style="cursor:pointer;" data-lang-code="de-de">Deutsch</a>
                            </li>
                        
                    
                        
                    
                         
                            <li>
                                <a style="cursor:pointer;" data-lang-code="es-es">Español</a>
                            </li>
                        
                    
                         
                            <li>
                                <a style="cursor:pointer;" data-lang-code="fr-fr">Français</a>
                            </li>
                        
                    
                         
                            <li>
                                <a style="cursor:pointer;" data-lang-code="it-it">Italiano</a>
                            </li>
                        
                    
                </ul>
            </div>
        </li>
        <script>
            (function() {
                const languageForm = document.querySelector('#gn-language-selector-form');
                const languageInput = languageForm.querySelector('input[name="language"]');
                
                const languageNodes = document.querySelectorAll('#gn-language-selector-dropdown .dropdown-menu li a');

                for (var i = 0; i < languageNodes.length; i++) {
                    languageNodes[i].addEventListener('click', function(event) {
                        const language = event.target.getAttribute('data-lang-code');
                        if (language) {
                            languageInput.value = language;
                            languageForm.action = '/i18n/setlang/?next=' + (window.location && (window.location.pathname + window.location.hash) || '/');
                            languageForm.submit();
                        }
                    });
                }
            })();
        </script>
    

                    
                </ul>
                
            </div>
        </div>
    </div>
</nav>
<script>
    (function () {
        function onResizeMenu(menu) {
            const menuContent = menu.querySelector('.gn-menu-content');
            const leftSide = menu.querySelector('.gn-menu-content-left');
            const leftSideMenuList = menu.querySelector('.gn-menu-content-left > .gn-menu-list');
            leftSideMenuList.style.position = 'absolute';
            leftSideMenuList.style.top = '50%';
            leftSideMenuList.style.transform = 'translateY(-50%)';
            const leftSideMenuDisplay = leftSideMenuList.style.display;
            const leftSideDropdown = menu.querySelector('.gn-menu-content-left > .dropdown');
            leftSideDropdown.style.position = 'absolute';
            leftSideDropdown.style.top = '50%';
            leftSideDropdown.style.transform = 'translateY(-50%)';
            function resize() {
                if (leftSide.clientWidth < leftSideMenuList.clientWidth) {
                    leftSideMenuList.style.visibility = 'hidden';
                    leftSideDropdown.style.visibility = 'visible';
                } else {
                    leftSideMenuList.style.visibility = 'visible';
                    leftSideDropdown.style.visibility = 'hidden';
                }
            }

            window.addEventListener('resize', resize);
            window.addEventListener('DOMContentLoaded', resize);

            resize();
        }
        const menus = document.querySelectorAll('[data-gn-menu-resize="true"]');
        for (var i = 0; i < menus.length; i++) {
            const menu = menus[i];
            onResizeMenu(menu);
        }
    })();
</script>


<script>
    (function () {
        const mainHeader = document.querySelector('.gn-main-header');
        const mainHeaderPlaceholder = document.querySelector('.gn-main-header-placeholder');
        const topbar = document.querySelector('#gn-topbar');
        function resize() {
            if (mainHeaderPlaceholder && mainHeader) {
                mainHeaderPlaceholder.style.height = mainHeader.clientHeight + 'px';
            }
            if (topbar && mainHeader) {
                topbar.style.top = mainHeader.clientHeight + 'px';
            }
        }
        window.addEventListener('resize', resize);
        window.addEventListener('DOMContentLoaded', resize);
        resize();
    })();
</script>


      <!-- End of Navbar -->

    <div class="alert alert-danger alert-dismissible" role="alert" id="ieflag" style="display:none">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
      <h1>You are using an outdated browser that is not supported by GeoNode.</h1>
      <p>Please use a <strong>modern browser</strong> like Mozilla Firefox, Google Chrome or Safari.</p>
    </div>

  <div id="wrap">
    
    <div class="container">
      
<div class="alert alert-warn" id="status-message" hidden="hidden">
    <a class="close" onclick="$('.alert').hide()">×</a>
    <strong><p id="status-message-text">Placeholder for status-message</p></strong>
    <p id="status-message-text-body">Placeholder for status-message-body</p>
</div>

      




      

      
      <div class="row">
        <div class="col-md-8">
        
  <div id="description"><h3>Page Not Found</h3></div>
  
      
          The page you requested does not exist.  Perhaps you are using an outdated bookmark?
      
  

        </div>
        <div class="col-md-4">
        
        </div>
      </div>
      
    </div>
    

    
    

  </div>

  
  

  


<footer class="gn-footer">
    <ul>
        <li>
            <a href="https://geonode.org/" class="nav-link">
                <span>geonode.org</span>
            </a>
        </li>
        <li>
            <a href="/developer/" class="nav-link">
                <span>Developers</span>
            </a>
        </li>
        <li>
            <a href="/about/" class="nav-link">
                <span>About</span>
            </a>
        </li>
    </ul>
</footer>




    <!-- Modal must stay outside the navbar -->
    
    <div class="modal fade" id="SigninModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title" id="myModalLabel">Sign in</h4>
          </div>
          <form class="form-signin" role="form" action="/account/login/?next=/api/v2/datasets&amp;format=json&amp;page_size=1" method="post">
            <div class="modal-body">
              <input type="hidden" name="csrfmiddlewaretoken" value="fIdka76Q6LaTOsCQUywzCumNVGBwp57Q58h9igXasyYu5J3yrzy5kt9J9gx6PFsg">
              
              
              <div class="form-group">
                <label for="id_username" class="sr-only">Username:</label>
                <input id="id_username" class="form-control" name="login" placeholder="Username" type="text" />
              </div>
              <div class="form-group">
                <label for="id_password" class="sr-only">Password:</label>
                <input id="id_password" class="form-control" name="password" placeholder="Password" type="password" autocomplete="off" />
              </div>
              <label class="checkbox">
                <input type="checkbox" /> Remember Me
              </label>
              <p>
                <a href="/account/password/reset/">Forgot Password?</a>
              </p>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary btn-block">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- End of Modal -->

    
    <script src="/static/lib/js/assets.min.js"></script>
    
    <script src="/static/geonode/js/utils/utils.js"></script>
    <script src="/static/geonode/js/base/base.js"></script>
    <script type="text/javascript" src="/jsi18n/"></script>
    
    <script type="text/javascript">
        // enable dropdown functionalities
        $('.dropdown-toggle').dropdown();
    </script>

    <script type="text/javascript">

      // Autocomplete instance for the search found in the header.
      $(document).ready(function() {
        window.autocomplete2 = new Autocomplete({
          form_btn: null,
          form_submit: '#search',
          form_selector: '#search',
          input_selector: '#search_input',
          container_selector: '#search-container',
          url: '/base/autocomplete_response/'
        })
        window.autocomplete2.setup()
      })

      $('#search').on('submit', (e) => {
          $('#search_abstract_input')[0].value =$('#search_input')[0].value;
          $('#search_purpose_input')[0].value = $('#search_input')[0].value;
      });

      $(window).on('load', function() {
          setTimeout(() => {
              document.body.scrollTop = 0;
              document.documentElement.scrollTop = 0;
          });
        });

      $(".datepicker").datepicker({
          format: "yyyy-mm-dd"
      });
    </script>

    <div class="modal fade" style="width: 100%; height: 100%;" id="_resource_uploading" data-backdrop="static" data-keyboard="false" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>Uploading...</h1>
                </div>
                <div class="modal-body">
                    <div class="progress">
                      <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
                        Upload in progress...
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" style="width: 100%; height: 100%;" id="_thumbnail_processing" data-backdrop="static" data-keyboard="false" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>Processing...</h1>
                </div>
                <div class="modal-body">
                    <div class="progress">
                      <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
                        Updating Thumbnail...
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="_thumbnail_feedbacks" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="exampleModalLabel">Message box</h4>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>

    <div id="confirmMsgBoxModalOK" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <!-- How to use it:
        $("#confirmMsgBoxModalOK").find('.modal-title').text('Title');
        $("#confirmMsgBoxModalOK").find('.modal-body').text('Message. Do you want to proceed?');
        $("#confirmMsgBoxModalOK_control_field").val('your_control_value');
        $("#confirmMsgBoxModalOK").modal("show");

        $('#confirmMsgBoxModalOK').find('.modal-footer #confirm').on('click', function() {
          if ($("#control_field").val() == 'your_control_value') {
            CONFIRMED
          }
        });
      -->
      <div class="modal-dialog">
        <input type="hidden" class="form-control" id="confirmMsgBoxModalOK_control_field" />
        <div class="modal-content panel-success">
          <div class="modal-header panel-heading">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Confirm</h4>
          </div>
          <div class="modal-body">
            <p>Some text in the modal.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger confirm" id="confirm">OK</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" style="width: 100%; height: 100%;" id="_perms_processing" data-backdrop="static" data-keyboard="false" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>Processing...</h1>
                </div>
                <div class="modal-body">
                    <div class="progress">
                        <div class="progress-bar progress-bar-info progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:100%">
                        Processing Resource...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

  </body>
</html>
