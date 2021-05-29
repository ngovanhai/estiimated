<?php
ini_set('display_errors', TRUE);
error_reporting(E_ALL); 
require   '../../conn-shopify.php'; 
?>
<!DOCTYPE html>
<html lang="en">

<head> 
    <meta charset="UTF-8"> 
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css" />
    <link type="text/css" rel="stylesheet" href="styles.css?v=<?php echo time(); ?>" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>

<body>

    <script>
        window.today = '<?php echo date('Y-m-d H:i:s',strtotime("-1 days")); ?>'; 
    </script>
    <div id="wp_list_script">
        <template>
			<b-container>
            <div class="wrapper_banner">
                MANAGE STORE ESTIMATED
            </div>
			<b-tabs v-model="tab"> 
				<b-tab title="">
					<template slot="title" > <i class="fa fa-tags" aria-hidden="true"></i> Manage Store </template>
					<manage-store></manage-store>
				 </b-tab> 
			</b-tabs>  
            </b-container>

        </template>
    </div> 
    <script>
        window.v = '<?php echo time(); ?>';
    </script>
     <script>
        window.rootApi = "../services/_generateJson.php";
        window.rootUpdateApi = "../services/_updateData.php";
        window.rootLink = '<?php echo $rootLink; ?>';
    </script>
    <script src="../lib/vue/vue.js"></script>
    <script type="text/javascript" src="https://windy.omegatheme.com/group-price-attribute/admin/version1/lib/httpVueLoader.js"></script>
    <script type="text/javascript" src="https://windy.omegatheme.com/group-price-attribute/admin/version1/lib/vue-multiselect.min.js"></script>
    <script src="https://windy.omegatheme.com/group-price-attribute/admin/version1/lib//polyfill.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vue-resource@1.5.1"></script>
    <script src="https://windy.omegatheme.com/group-price-attribute/admin/version1/lib/bootstrap-vue.js"></script> 
    <script src="index.js?v=<?php echo time(); ?>"></script>
</body>

</html> 