<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>

<body>
<%
String dhcp = request.getParameter("dhcp");
out.println("DHCP : "+ dhcp +"<br>");
%>   
</body>
</html>