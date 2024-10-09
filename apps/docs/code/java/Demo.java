package apps.docs.code.java;

public class Demo {

  int x;

  // 以下是构造函数
  Demo(int i) {
    x = i;
  }

  protected void finalize() {
    // 在这里终结代码
    System.out.println("Object is garbage collected");
  }
}
