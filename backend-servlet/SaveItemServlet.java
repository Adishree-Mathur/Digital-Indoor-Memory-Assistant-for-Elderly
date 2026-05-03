import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;

public class SaveItemServlet extends HttpServlet {

    static List<String> items = new ArrayList<>();

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        BufferedReader reader = request.getReader();
        String body = reader.readLine();

        items.add(body);

        response.setContentType("text/plain");
        response.getWriter().write("Saved");
    }
}