package apps.docs.code.java;

import java.util.regex.*;

import java.util.Date;

public class Test {

   public static void main(String[] args) {
      System.out.print("\n");
      String[] names = { "one", "two", "three" };
      for (String name : names) {
         System.out.print(name + "\n");
      }

      boolean flag = true;
      System.out.println(flag ? "Flag is true" : "Flag is false");

      int[] list = new int[3];
      for (int i = 0; i < list.length; i++) {
         System.out.println(list[i]); // 0 0 0
      }

      // 初始化 Date 对象
      Date date = new Date();

      // 使用 toString() 函数显示日期时间
      System.out.println(date.toString());
      System.out.println(date.getTime());

      String content = "I am noob " +
            "from runoob.com.";

      String pattern = ".*runoob.*";

      boolean isMatch = Pattern.matches(pattern, content);
      System.out.println("字符串中是否包含了 'runoob' 子字符串? " + isMatch);

      Demo t1 = new Demo(10);
      Demo t2 = new Demo(20);
      System.out.println(t1.x + " " + t2.x);
   }
}
