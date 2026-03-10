package ut.com.atlassian.aservo.myPlugin;

import org.junit.Test;
import com.atlassian.aservo.myPlugin.api.MyPluginComponent;
import com.atlassian.aservo.myPlugin.impl.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest {
    @Test
    public void testMyName() {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent", component.getName());
    }
}