# Trip Planner
__Trip Planner__ is a web application that let users plan a trip, be it a vacation trip, expedition trip or a road trip! 

## App Demo
You can try the app yourself [here](https://holiday-trip-planner.herokuapp.com/login)! 

__NOTE__: This application will not work with web browsers that utilises Apple's WebKit engine (e.g. Safari on the desktop, all web browsers on iOS and iPadOS) due to the incompatibility with the Fetch API. Hence, this application will only work on non-iOS/iPadOS devices.

## Summary
Trip Planner is a web application that allows users to plan a trip. For each trip, users are able to create a new trip, set the origin, stopover(s), and destination waypoints, as well as the location, date, time, and tasks at each waypoint. In addition, users can also add friends and invite them to trips.

## Technologies Used

### Frameworks
![](https://img.shields.io/badge/Backend_Framework-Django_REST_Framework-informational?style=for-the-badge&logo=django&color=006106)
![](https://img.shields.io/badge/Frontend_Framework-ReactJS-informational?style=for-the-badge&logo=react&color=4dd8ff)

### Languages
![](https://img.shields.io/badge/Backend_Language-Python3-informational?style=for-the-badge&logo=python&color=blue)
![](https://img.shields.io/badge/Frontend_Language-JavaScript-informational?style=for-the-badge&logo=javascript&color=ffdd00)
![](https://img.shields.io/badge/Frontend_Language-HTML5-informational?style=for-the-badge&logo=html5&color=ff6338)
![](https://img.shields.io/badge/Frontend_Language-CSS3-informational?style=for-the-badge&logo=css3&color=386aff)

### Database
![](https://img.shields.io/badge/Database-SQLite-informational?style=for-the-badge&logo=sqlite&color=57a5f2)

### Libraries
![](https://img.shields.io/badge/Libraries-Bootstrap-informational?style=for-the-badge&logo=bootstrap&color=7714a8)

## Getting Started

NOTE: Before proceeding, please go through `requirements.md` to install the necessary packages and libraries.
* Firstly, download the [source code](https://github.com/farhanazmiCS/trip-planner/archive/refs/heads/master.zip).

* Open a terminal window and enter the `capstone` directory by typing `cd capstone`. 

* Open another terminal window, and enter the `react-roadtrip` directory by typing `cd capstone/react-roadtrip`.

* For this application to run, you would need an __access token__ for the MapBox API. You can generate this by signing up for a MapBox account [here](https://account.mapbox.com/auth/signup/).

* Once the token is generated, you can include the token in line 112 of the `App.js` file in the `/react-roadtrip/src` directory, then save the file. 
  ```js ...
  const access_token = 'YOUR_ACCESS_TOKEN';
  ```

* In the `capstone` directory, run `python3 manage.py makemigrations` to run database migrations.

* Afterwards, in the same directory, run `python3 manage.py migrate` to apply the migrations.

* In the `capstone` directory, run `python3 manage.py runserver`. This will host a local server for the backend.

* In the terminal window for the `react-roadtrip` directory, run `npm start`. This will start a React application, which will serve as the client-side code.

At this point, you're all set! You can now proceed to `http://localhost:3000` (the default host and port) to use this web application.

## After Setting Up

Listed below are the functions and components of the web application necessary for it to function, for both the client
and server-side.

### Index and App files
> Path: `react-roadtrip/src/`

#### Index
The `index.js` file renders the `<App />` component inside the `div` element of id `root` in the `index.html` page by calling the `ReactDom.render` function.

#### App
The `App.js` file serves as the 'hub' of the React application. It contains the __App__ component, which contain much of the hooks and functions to be used by the __App__ component itself or passed down to it's child components. 

Examples of hooks and functions are the _username_ and _password_ state hooks, both being `useState` hooks that are passed down to the __Login__ component to control the state of the login form fields. To learn out more about the useState hook, click [here](https://reactjs.org/docs/hooks-state.html). 

Another example is the `onLoadorRefresh` function, called by the `useEffect` hook when the state of `isLoggedIn` or `tripCounter` changes. The `useEffect` hook is used as a side effect function, taking a function and a dependency array as arguments. More on the  `useEffect` can be learnt [here](https://reactjs.org/docs/hooks-effect.html).

The __App__ component will return several components. Below is the list of components that is returned by the __App__ component:
* __NavigationBar:__ Only renders when the `isLoggedIn` state hook is set to `true`.

* __Routes:__ Defines the available route paths with the help of React Router DOM.

  * __Route path `/`:__ Loads the __Home__ component when queried `http://localhost:3000/`.
  
  * __Route path `/create-trip`:__ Loads the __CreateTrip__ component when queried `http://localhost:3000/create-trip`.
  
  * __Route path `/trips`:__ Loads the __Trips__ component when queried `http://localhost:3000/trips`.
  
  * __Route path `/trip/:tripId`:__ Loads a __Trip__ component, given a trip id, when queried `http://localhost:3000/trip/${id}`.

  * __Route path `/users`:__ Loads the __FindUsers__ component when queried `http://localhost:3000/users`.
  
  * __Route path `/profile/:userId`__ Loads a __Profile__ component, given a user id, when queried `http://localhost:3000/profile/${id}`.
  
  * __Route path `/notifications`:__ Loads the __Notifications__ component when queried `http://localhost:3000/notifications`.
  
  * __Route path `/login`:__ Loads the __Login__ component when queried `http://localhost:3000/login`.
  
  * __Route path `/register`:__ Loads the __Register__ component when queried `http://localhost:3000/register`.
    
  * __Route path `*`:__ A wildcard route for a route that is not defined by any of the routes listed above.

### Pages 
> Path: `react-roadtrip/src/pages`

The following items are the "pages" of the web application. They are ultimately React components.

* Home
* Login
* Register
* CreateTrip
* Trips
* Trip
* Profile
* Notifications
* FindUsers

#### Home
Depending on whether the authentication token is present in `sessionStorage`, the __Home__ component, defined in the `Home.js` file, re-routes the user to the __Login__ page or the __Trips__ page, with the help of React Router.

#### Login
* The __Login__ component is defined in the `Login.js` file, rendering the login form containing the password and input fields.

* The __Login__ button, when clicked, calls the `handleLogin` function, a function 'prop' that is property passed down from the parent component `App`.

* The `handleLogin` function takes the form data and sends it to the back-end as JSON payload.

* If the login is successful, the user is directed to the __Trips__ page, if not, an error message will be displayed, informing the user what went wrong.

* The user can also click the sentence below the __Login__ button to create an account if the user does not have one.

#### Register 
* The __Register__ component is defined in the `Register.js` file, rendering the registration form containing the email, username, password and confirm password fields.

* The __Register__ button, when clicked, calls the `handleRegister` function, which handles the submission of the form data to the backend as JSON payload.

* If the registration is successful, the user is logged in automatically and is then redirected to the __Trips__ page. If not, an error message will be displayed.

* The user can click the sentence below the __Register__ button to be redirected to the login page if the user already has an account.

#### CreateTrip
* The __CreateTrip__ component is defined in the `CreateTrip.js` file and renders the page that allows the user to create a new trip. 

* When this page is loaded, the name of the trip, by default, is set to 'Trip Name'. On the right of it is an edit button, a pencil icon, when clicked or pressed, will change the header to an input field, allowing the user to change the name of the trip.

* Below the name header, a button of content __Set Origin__ is displayed. When the user clicks this button, a __WaypointModal__ component appears, containing a form. In this form, the user can set the parameters of the Origin waypoint, such as location, date and time, and todo items. More information of this modal will be explained in detail in the __Components__ section.

* When the Origin waypoint parameters are set, the user can set the waypoint by pressing the __Set Origin__ button, after which the __Waypoint__ component is rendered within the __CreateTrip__ page. The user can edit the waypoints by pressing the pencil icon displayed on each __Waypoint__ component.

* After setting the origin waypoint, the user will have an option of either setting the destination or adding stopovers. The functionality of pressing the __Add Stopover__ or __Set Destination__ buttons are identical to that of setting the origin waypoint. All the waypoints are editable, but only the stopover points are deletable.

* The user can then save the trip by clicking or pressing the __Save Trip__ button, which will submit the data as JSON to the back-end for processing. If successful, the user will be redirected back to the __Trips__ page, with the new trip being displayed in the page.

#### Trips
* The __Trips__ component is defined in the `Trips.js` file that renders all of the user's trips.

* The user can click or press any of the trips to view more information of the trip, which will direct them to the __Trip__ page.

#### Trip
* The __Trip__ component is defined in the `Trip.js` file, displaying information about a particular trip.

* Information such as the __Trip Name__, __Origin__ waypoint, __Stopover__ waypoints, __Destination__ waypoints as well as their associated data are displayed in this page.

* If the user is in the trip that he or she is viewing, the user can view the users that are following the trip and invite friends to the trip by clicking or pressing the __Invite Friends__ button located at the top right corner of the page. This functionality is demonstrated in the gif below:

<div align="center">
  <img width="250" src="https://user-images.githubusercontent.com/68798786/156515689-a4dc6b89-6fd8-4007-a796-72fee56a30b3.gif" alt="todo">
</div>
<br />

* In addition user can also edit the properties of the trip, such as modifying the trip name, changing the Origin, Stopover and Destination waypoint properties, and adding new stopovers. This functionality is demonstrated in the gifs below:

  __Changing Trip Name__
  <div align="center">
    <img width="250" src="https://user-images.githubusercontent.com/68798786/156515828-6bb4eb43-ff7c-4e43-8267-ba8e6f8cb579.gif" alt="todo">
  </div>
  <br />

  __Modifying Waypoints__
  <div align="center">
    <img width="250" src="https://user-images.githubusercontent.com/68798786/156515897-84b6ca7f-e733-4016-997b-1d05bd9b0f52.gif" alt="todo">
  </div>
  <br />

* When the properties of the trip changes, the __Save Changes__ button appears. On click, this button will send the payload, containing the new trip name and/or the updated waypoints in JSON. The backend will provide the updated trip object as a response.

#### Profile 
* The __Profile__ component is defined in the `Profile.js` file, displaying information about a queried user.

* In this page, the __username__ of the user is displayed at the top middle. Below it displays the __trip count (shown as Trips)__ and __friend count (shown as Friends)__.

* A button is displayed in this page, below the __Trips__ and __Friends__ header. Depending on the condition, the content and type of button may vary:

  __Scenario 1.__ When __user2__ (logged-on user) is not a friend of __user1__ (profile being viewed), and a friend request has __not__ been sent
   <div align="center">
      <img width="336" alt="Not Friend, No Request" src="https://user-images.githubusercontent.com/68798786/156513085-3fbe3172-1005-4606-bc5b-2a76f66cd1c9.png">
   </div>
   <br />
 
  __Scenario 2.__ When __user2__ is not a friend of __user1__, friend request has been sent
   <div align="center">
       <img width="336" alt="Not Friend, with Request" src="https://user-images.githubusercontent.com/68798786/156513148-97149d6f-b31d-40e2-8b99-fcdadd2ba65a.png">
   </div>
   <br />

  __Scenario 3.__ __user2__ is a friend of __user1__. In addition to the button change, the __friend count__ (Displayed as Friends) is updated. __user1's__ trips are also displayed, which allows __user2__ to view them.
   <div align="center">
      <img width="333" alt="Friend" src="https://user-images.githubusercontent.com/68798786/156513199-56985393-fca0-4e21-8ad5-f3f6e95c19c4.png">
   </div>
   <br />

#### Notifications 
* The __Notifications__ component is defined in the `Notifications.js` file. It displays notifications from other users.

* The user may receive two different types of notifications, a __trip invite__ or a __friend request__.

* For every notification, the user can opt to accept or decline a notification by pressing the __Accept/Decline__ button, like the one shown below.
 <div align="center">
    <img width="335" alt="Friend Request Notification" src="https://user-images.githubusercontent.com/68798786/156513390-7acf4c2e-b3d8-44b1-b1c7-3d3ac1844e0c.png">
 </div>
 <br />

#### FindUsers
* The __FindUsers__ component is defined in the `FindUsers.js` file. It consists of a page that incorporates an `AsyncTypeAhead` input field that allows the user to search for other users.

### Components
> Path: `react-roadtrip/src/components/`

The following items are the "components" of the React portion of the web application.
They are utilised by the "pages".

* NavigationBar
* Todo
* Waypoint
* WaypointModal
* FriendsListModal

#### NavigationBar
* The __NavigationBar__ component is defined in the `NavigationBar.js` file. It renders the navigation bar at the top of the page when the user is logged in.
* The navigation bar can be used to navigate through the web application, such as:

  1. __Trips__ page
  2. __Create Trip__ page
  3. __Find Users__ page
  4. __My Profile__ page
  5. __Notifications__ page
  6. __My Profile__ page
  7. __Logout__ button

#### Todo
* The __Todo__ component is defined in the `Todo.js` file. It takes the form of an input field that is part of the __WaypointModal__ component, used for the user to add todo items in every waypoint object.

* The user can add as many todo items as they desire, as demonstrated in the gif below:
 <div align="center">
   <img width="250" src="https://user-images.githubusercontent.com/68798786/148171801-8cf78174-65a1-48ef-9e73-f215fcde0314.gif" alt="todo">
 </div>
 <br />
 
#### Waypoint
* The __Waypoint__ component is defined in the `Waypoint.js` file and displays the information of a particular waypoint.

* Information such as location, date and time, and todo items are displayed in this component.

* It is rendered using a __Card__ component as defined in the React-Bootstrap library.

#### WaypointModal
* The __WaypointModal__ component is defined in the `WaypointModal.js` file. It displays a bootstrap modal component when the user presses or clicks the __Set Origin/Add Stopover/Set Destination__ button in the __CreateTrip__ page.

* In the modal contains a form containing input fields that allows the user to query for a specific location, set the date and time period of the waypoint, and add todo items.

* The user can then press the __Set Origin/Add Stopover/Set Waypoint__ button at the bottom of the modal to complete the form.

#### FriendsListModal
* The __FriendsListModal__ component is defined in the `FriendsListModal.js` file. It displays a bootstrap modal component when the user, when viewing a user's profile, presses the number below the 'Friends' header. The user can click on any of the usernames present in the modal to view a profile. The gif below demonstrates this:

<div align="center">
    <img width="250" src="https://user-images.githubusercontent.com/68798786/156516133-48d6faaa-f8ad-4b5a-b4b6-3e0130ce4e30.gif" alt="todo">
</div>
<br />

### Other Files
#### Helper File
> Path: `react-roadtrip/src/`

The `helper.js` file contains four helper functions:

  1. `todayDateAndTime()` - This function creates a new `Date` object and will return an array containing today's date, `todayDate` and current time, `timeNow`. 
  2. `formatDateTime()` - This function takes the date and time formatted in HTML and formats it to a string that can be understood by Python. Returns a string type.
  3. `dateFormatter()` - Formats the date from numbers to characters. For example, _2022-02-18_ will become _18 February, 2022_. Returns a string.
  4. `timeFormatter()` - Formats 24 hour time to 12 hour time. For example, _13:24_ will become _01:24 PM_. Returns a string.

### Backend

The backend utilises Django-REST Framework, a Django extension used to develop a Representational State Transfer (REST) API. The backend does not perform any rendering of the data into HTML, but handles the data, serializes them into JSON and providing a response back to the client.

There are several parts in the backend that needs to be discussed, namely:
- Settings `capstone/capstone/settings.py`

- Validators `capstone/capstone/validators.py`

- Views `capstone/roadtrip/views.py`

- Models `capstone/roadtrip/models.py`

- Serialization `capstone/roadtrip/serializers.py`

- URLs `capstone/roadtrip/urls.py`

#### Settings
The `settings.py` file sets the parameters of the application. Listed below are some parameters modified for use in this application:
- `ALLOWED_HOSTS`: Defines the servers that can host the backend.

- `AUTH_USER_MODEL`: Defines the model for authentication. In this case, the auth user model is the `User` class, defined in `models.py`.

- `CORS_ALLOWED_ORIGINS`: Defines the url that can make requests to the backend.

- `INSTALLED_APPS`: Defines the apps that are installed in this Django project. The additional apps are listed below:
    - _roadtrip_: The app as well as it's files lies in this directory
 
    - _rest_framework_: For Django REST Framework
 
    - _rest_framework.authtoken_: For DRF token authentication
   
    - _corsheaders_: To enable [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests 

- `AUTH_PASSWORD_VALIDATORS`: Defines the password validators used when a password is being created for a user. On top of the default validator classes included in Django, an additional validator class, `MandatoryCharacterValidator`, is defined. This will be further explained in the __Validators__ section.

#### Validators
The additional validator class, `MandatoryCharacterValidator`, is defined in the `validators.py` file. This validator class checks the password if it contains at least one of the following characters:

- Uppercase letter
- Lowercase letter
- Numeral
- Special character / symbol

#### Views
The views in the backend are contained in the `views.py` file, which contain several class-based views. Listed below are the views, as well as their associated methods:
  
  **`UserViewSet`**
  
  | Method  |  Parameters (Except for `self` and `request`) | How it works 
  |---|---|---|
  | `list` |  None |  Queries and list all the registered users. |
  | `get_user`  |  `pk` | Retrieves the information of a particular user using the `get_object_or_404` function, with the queryset and an user id `pk` as                           a parameter. If the queried user does not exist, raises a `Http404` exception.  |
  | `register`  | `pk`  | This method is used to create a new user account. The program takes `email`, `username`, `password` and `confirm` as input.       Afterwards, the program checks if the `password` and the `confirm` fields are the same. If the `password` and `confirm` fields                             are not the same, the program will return a HTTP `400` code and an error message. Otherwise, the program will then call the                               `validate_password` function.<br /><br /> The `validate_password` function checks the password against the password validators declared in `settings.py`. If the validation fails, the program will raise a `ValidationError` and return an HTTP status of `400` and return              an error message. Otherwise, the program will attempt to create a new user instance.<br /><br /> As the program attempts to create a new                    user instance using the `AUTH_USER_MODEL` declared in `settings.py`, the program will check if the username already exists in                             the database. If it does, the program will raise an `IntegrityError`, return a `404` HTTP status code and an error message.                               Otherwise, the program generates a new token for the user, for the [token-based authentication](https://www.django-restframework.org/api-guide/authentication/#tokenauthentication).<br /><br /> After generating a new token for the user object, the user                                   registration process is considered successful and returns a dictionary response containing the user's `username`, `token` and a                           `200` HTTP status code. |
  | `add_friend`| `pk`  | This method is used when accepting a user's friend request. When a user accepts a friend request, two request payloads are         submitted to the server to this method. The `pk` is an id of either the "requester" and the "requestee". The JSON payload                                 contains the data of the other user (e.g. if `pk` is user 1, the JSON payload contains the data for user 2, and vice-versa). The                           program then takes the id from the payload and adds it into each of the users' `friends` many-to-many attribute.<br /><br />In addition,                   both of the users' `friendCounter` attribute will be set to the length of each of their many-to-many attribute. Afterwards, both                           of the users' user instance are saved using the `save()` method and the program returns a HTTP `200` response.  |
  | `remove_friend` | `pk` | Removes a user from both the logged-on and the queried users' friends list, with `user1` being `request.user` and `user2`, with an id of `pk`, being the queried user. Using the `remove()` method, the program removes the user instance from each of the users' `friends` many-to-many attribute.<br /><br /> In addition, both of the users' `friendCounter` attribute is also updated to the new length of the `friends` many-to-many attribute. Lastly, the user instances for both objects are saved using the `save()` method, and the program returns an HTTP status code of `200`.|

**`TripViewSet`**
  
  `list()` 
  
  Lists all the logged-on user's trips.
  
  `list_other_trip(pk)` 
  
  Lists the trips of a user, given a key (user id) as a parameter.
  
  `get_trip(pk)` 
  
  Retrieve a particular trip, given a key (trip id) as a parameter.
  
  `save_trip()` 
  
  Create a new trip object.

  `save_changes(pk)` 
  
  Updates an existing trip object with a new tripName and/or waypoints.
 
  `add_friend_to_trip()` 
  
  Add a user object to the __users__ key in a trip object.

- `WaypointViewSet`
  - __get_waypoint:__ Retrieve a waypoint object, given a key (waypoind id) as a parameter.

- `TodoViewSet`
  - __get_todo:__ Retrieve a todo object, given a key (todo id) as a parameter.

- `NotificationViewSet`
  - __list:__ List all the logged-on user's notifications (Friend requests and trip invites made by other users to the logged-on user).
 
  - __my_requests_friends:__ Lists all the friend request notifications that originate from the logged-on user.
 
  - __my_requests_trips:__ Lists all the trip invite notifications that originate from the logged-on user.
 
  - __send_request:__ Create a new notification object, originating from the logged-on user.

  - __delete_notification:__ Delete a notification object. Used when a user accepts or declines a request.

- `LoginView`
  - __get:__ When a client requests this endpoint with the appropriate authorization headers, the API will provide a response code of `200`. If there are no authorization headers present, `request.user` will return `None` and will return a HTTP status of `400`.

  - __post:__ Takes the login form and processes it. Returns a user object if matching credentials found, else returns `404` if no user found with the queried username, or `401` if the password is incorrect.

#### Models
The models below are defined in the `models.py` file:
- __User__
- __Trip__
- __Waypoint__
- __Todo__
- __Notification__

__User__

The __User__ model inherits from the `AbstractUser` class which contain attributes such as username and email. Additionally, the model also feature attributes such as friends, a `many-to-many` field, as well as friendCounter and tripCounter, both of which are `integerField`s.

__Trip__

The __Trip__ model features a few attributes which will be explained below:

- __name:__ A `charField` instance describing the name of the trip.

- __origin:__ Has a `many-to-one` relation to a __Waypoint__ object, describing the attributes of the origin.

- __destination:__ Has a `many-to-one` relation to a __Waypoint__ object, describing the attributes of the destination.

- __waypoint:__ Has a `many-to-many` relationship to multiple __Waypoint__ objects, describing the attributes of the stopovers.

- __users:__ Has a `many-to-many` relationship to multiple __User__ objects. The __users__ in a trip describe the users that are following a particular trip.

__Waypoint__

The __Waypoint__ model describes the attribute of each waypoint object:

- __text:__ A `charField` instance. Describes the name of the location, but shortened.

- __place_name:__ A `charField` instance. Describes the name of the location in detail.

- __longitude:__ A `DecimalField` instance describing the longitude data of the location.

- __latitude:__ A `DecimalField` instance describing the latitude data of the location.

- __dateTimeFrom:__ A `DateTimeField` instance describing the date and time where the user begins being at the waypoint.

- __dateTimeTo:__ A `DateTimeField` instance describing the date and time where the user ends being at the waypoint.

- __todo:__ Has a `many-to-many` relationship to multiple __Todo__ objects.

__Todo__

Each __Todo__ object contain a single attribute __task__, a `textField` instance.

__Notification__

The __Notification__ model describes the attribute of each notification object:

- __frm:__ Has a `many-to-one` relation with a user object. This user object is the sender.

- __to:__ Has a `many-to-one` relation with a user object. This user object is the recipient.

- __isAddFriend:__ A `booleanField` attribute. If `True`, this notification object is a friend request.

- __isInviteToTrip:__ A `booleanField` attribute. If `True`, this notification object is a trip invitation.

- __trip:__ Has a `many-to-one` relation with a trip object. If the __isInviteToTrip__ attribute is `True`, a notification object will be sent to the recipient with the related trip object.

#### Serialization
The `serializers.py` file contains the code that serializes the __ModelViewSet__ into JSON. Listed below are the serializers:

- __FriendSerializer:__ Serializes a `User` object into the fields _id_, _username_ and _email_.

- __UserSerializer:__ Serializes a `User` object into the fields _id_, _username_, _email_, _friends_, and _friendCounter_. The _friends_ field is serialized by the __FriendSerializer__.

- __TodoSerializer:__ Serializes a `Todo` object into the fields _id_ and _task_.

- __WaypointSerializer:__ Serializes a `Waypoint` object into the fields _id_, _text_, _place_name_, _longitude_, _latitude_, _dateTimeFrom_, _dateTimeTo_ and _todo_. The _todo_ field is serialized by the __TodoSerializer__.

- __TripSerializer:__ Serializes a `Trip` object into the fields _id_, _name_, _origin_, _destination_, _waypoint_ and _users_. The _origin_, _destination_ and _waypoint_ fields are serialized by the __WaypointSerializer__ and the _users_ field is serialized by the __UserSerializer__.

- __NotificationSerializer:__ Serializes a `Notification` object into the fields _id_, _frm_, _to_, _is_addFriend_, _is_inviteToTrip_ and _trip_ fields. The _frm_ and _to_ fields are serialized by the __UserSerializer__ and the _trip_ field is serialized by the __TripSerializer__.

#### URLs
The application's URL endpoints are defined in the `urls.py` file in the `capstone/roadtrip/` directory. DRF allows for a simplified URL definition when combined with __ViewSets__, or class-based views. 

Firstly, a router is defined via importing `router` from the `rest_framework` library. After defining the router, each __ViewSet__ can be registered to the router. An example for registering a `UserViewSet` router is as follows:
```python
...
router.register(r'users', UserViewSet)
```
with the first argument being the _prefix_, the first parameter after the `/` of a URL, and the second argument being the _viewset_.

```python
class UserViewSet(viewsets.ModelViewSet):
  ...
  def list(self, request):
    ...
```

Now, when the user goes to `http://127.0.0.1:8000/users`, the router will load the `list` method of the `UserViewSet`. Below is a list of default routes that is defined by the router, as well as their associated methods, using the `UserViewSet` as an example:

__Endpoint__ --> __Method__

`http://127.0.0.1:8000/users` --> `list`

`http://127.0.0.1:8000/users/{pk}` --> `detail`

The app does more than just listing and retrieving data from the backend. Thus, custom actions for routing was utilised. To implement this, an `@action()` decorator was added at the top of a class method. Below is an example on a `UserViewSet`, for a method to register a new user:

```python
class UserViewSet(viewsets.ModelViewSet):
  ...
  @action(methods=['POST'], detail=False)
  def register(self, request):
    ...
```
In this method, an `@action()` decorator is declared at the top of the method, with the first argument being the accepted HTTP request methods, and the second being the detail (The detail will be set to `True` when `pk`, or primary key, is used). In this case, the URL endpoint is as follows:

```http://127.0.0.1:8000/users/register/```

with the second parameter, after `/users`, being the name of the method.

Another example, for adding a _friend_ to a `User` object:

```python
class UserViewSet(viewsets.ModelViewSet):
  ...
  @action(methods=['PUT'], detail=True)
  def add_friend(self, request, pk=None):
    ...
```
For this method, the URL endpoint is defined as:

```http://127.0.0.1/users/{pk}/add_friend/```

where the __pk__ is the second parameter, and the __method name__ is the third.

Lastly, to add the URLs defined in the router to the `urlpatterns` list, this line of code was inserted below the `urlpatterns`:

```python
urlpatterns += router.urls
```
