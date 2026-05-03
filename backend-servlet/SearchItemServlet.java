import java.io.*;
import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;

public class SearchItemServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String query = request.getParameter("item");

        for (String item : SaveItemServlet.items) {
            if (item.toLowerCase().contains(query.toLowerCase())) {
                response.setContentType("application/json");
                response.getWriter().write(item);
                return;
            }
        }

        response.getWriter().write("{}");
    }
}