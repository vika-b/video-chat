<!DOCTYPE html>
<html>
<head>
    <base href="/">
    <title>Angular With Webpack</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <script src="http://cdn.peerjs.com/0.3/peer.js"></script>
</head>
<body>
<my-app>
    <style>
        .wh-height {
            height: 100vh;
        }
        .flex-center {
            display: flex;
            align-items: center;
            justify-content: center
        }
    </style>
    <div class="wh-height flex-center">
        <img src="{{ url('img/loading.gif') }}" alt="Loader">
    </div>
</my-app>
<script type="text/javascript" src="{{asset('js/app.js')}}"></script>
</body>
</html>