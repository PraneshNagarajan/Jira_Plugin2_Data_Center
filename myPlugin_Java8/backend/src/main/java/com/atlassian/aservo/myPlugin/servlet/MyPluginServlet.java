package com.atlassian.aservo.myPlugin.servlet;

import com.atlassian.templaterenderer.TemplateRenderer;
import com.atlassian.plugin.webresource.WebResourceManager;
import com.atlassian.plugin.spring.scanner.annotation.imports.ComponentImport;
import javax.inject.Inject;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MyPluginServlet extends HttpServlet {
    @ComponentImport
    private final TemplateRenderer templateRenderer;
   
    @Inject
    public MyPluginServlet(final TemplateRenderer templateRenderer) {
        this.templateRenderer = templateRenderer;
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        Map<String, Object> context = new HashMap<>();
        res.setContentType("text/html;charset=UTF-8");
        context.put("contextPath", req.getContextPath());
        templateRenderer.render("templates/app.vm", context, res.getWriter());
    }
}