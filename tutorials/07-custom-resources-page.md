Geonode allows for the creation of custom pages to display specific types of resources of interest. In this way, it is possible to create a page with a title and some text, to perhaps, display only dashboards, a particular category or group, etc.

Below are the steps required to create a custom resource grid page:

- create a new html template named `geostory_resources_page.html` inside the `geonode-project-name/src/geonode_project_name/templates/ `directory

```
geonode-project-name/
|-- ...
|-- src/
|    |-- geonode_project_name/
|         |-- ...
|         +-- templates/
|              |-- ...
|              +-- geostory_resources_page.html
|-- ...
```

- add the following block extension in the `geostory_resources_page.html` template

```html
{% extends "page.html" %}

{% block container %}
    <div class="gn-container">
        <div id="custom-resources-grid"></div>
    </div>
    <script>
        window.addEventListener('mapstore:ready', function(event) {
            const msAPI = event.detail;
            msAPI.setPluginsConfig([
                {
                    name: 'ResourcesGrid',
                    cfg: {
                        targetSelector: '#custom-resources-grid',
                        containerSelector: '.gn-container',
                        menuItems: [],
                        filtersFormItems: [],
                        defaultQuery: {
                            f: 'geostory'
                        },
                        pagination: true
                    }
                },
                { name: 'SaveAs', cfg: { closeOnSave: true } },
                { name: 'DeleteResource' },
                { name: 'DownloadResource' },
                { name: 'Notifications' }
            ]);
        });
    </script>
{% endblock %}

```

- add the new page inside urls.py inside urlpatterns list

```python
urlpatterns += [
    url('geostory_resources_page', view=TemplateView.as_view(template_name='geostory_resources_page.html'))
]
```

- Now visit `/geostory_resources_page`. You should see a new page displaying a grid of geostories from the database.


