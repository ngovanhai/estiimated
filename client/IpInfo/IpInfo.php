<?php
function ConnectToIpDb () {
	$db = new Mysqli("localhost", "shopify", "h1yw5ovS78iYaGRX", "ip2location"); 
    if($db->connect_errno){
        die('Connect Error: ' . $db->connect_errno);
    }
    return $db;
}

function isIpV6($ip) {
    if (strpos($ip, ':')) {
        return true;
    }
    return false;
}

// Function to convert IP address to IP number (IPv6)
function Dot2LongIPv6 ($IPaddr) {
    $int = inet_pton($IPaddr);
    $bits = 15;
    $ipv6long = 0;
    while($bits >= 0){
        $bin = sprintf("%08b", (ord($int[$bits])));
        if($ipv6long){
            $ipv6long = $bin . $ipv6long;
        }
        else{
            $ipv6long = $bin;
        }
        $bits--;
    }
    $ipv6long = gmp_strval(gmp_init($ipv6long, 2), 10);
    return $ipv6long;
}

function IpToInfo($userIp) {
    $table_ipv4_to_location = "ip2location_db11";
    $table_ipv6_to_location = "ip2location_db11_ipv6";
    // Connect to database
    $db = ConnectToIpDb();
    $info = array();
    if (isIpV6($userIp)) {
        $ipno = Dot2LongIPv6($userIp);
        $query = $db->query("SELECT * FROM $table_ipv6_to_location WHERE ip_to >= $ipno ORDER BY ip_to LIMIT 1");
    } else {
        $query = $db->query("SELECT * from $table_ipv4_to_location WHERE inet_aton('$userIp') <= ip_to LIMIT 1");
    }
    if ($query) {
        while ($row = $query->fetch_assoc()) {
            $info = $row;
        }
    }
    return $info;
}

?>
