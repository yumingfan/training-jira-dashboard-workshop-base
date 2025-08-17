using Xunit;

namespace JiraDashboard.Tests;

public class SimpleTests
{
    [Fact]
    public void SimpleTest_ReturnsTrue()
    {
        // Arrange
        var result = true;
        
        // Act & Assert
        Assert.True(result);
    }

    [Fact]
    public void BasicMath_Works()
    {
        // Arrange
        var a = 2;
        var b = 3;
        
        // Act
        var result = a + b;
        
        // Assert
        Assert.Equal(5, result);
    }

    [Theory]
    [InlineData(1, 1, 2)]
    [InlineData(2, 3, 5)]
    [InlineData(-1, 1, 0)]
    public void Addition_ReturnsCorrectSum(int a, int b, int expected)
    {
        // Act
        var result = a + b;
        
        // Assert
        Assert.Equal(expected, result);
    }
}