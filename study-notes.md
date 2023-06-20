## Creating a controller

```bash
$ php artisan make:controller Api/UserController --model=User --requests --resource --api

# php artisan: it is the command to run artisan
# make:controller: it is the command to create a controller
# Api/UserController: it is the name of the controller
# --model=User: it is the model that the controller will use
# --requests: it is the requests that the controller will use
# --resource: it is the resource that the controller will use
# --api: it is the api that the controller will use
```

## Creating a resource

-   Resource is a class that helps us to transform our data into a JSON format.

```bash
$ php artisan make:resource <resource-name>
```
