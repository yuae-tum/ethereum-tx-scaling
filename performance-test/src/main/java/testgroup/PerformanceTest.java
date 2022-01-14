package testgroup;

public class PerformanceTest
{
    public static void main( String[] args )
    {
        int n = 48;
        System.out.println("Starting performance test, n = " + n);
        while(true) {
            long timeStarted = System.currentTimeMillis();
            long number = fib(n);
            long timeFinished = System.currentTimeMillis();
            System.out.println("result: " + number + "; solved in " + ((timeFinished - timeStarted) / 1000) + "s");
        }
    }

    public static long fib(int n) {
        if(n == 0) {
            return 0;
        } else if (n == 1) {
            return 1;
        } else {
            return fib(n-1) + fib(n-2);
        }
    }
}
