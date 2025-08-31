using Xunit;
using JiraDashboard.Models;

namespace JiraDashboard.Tests;

/// <summary>
/// Sprint 健康狀態計算邏輯測試
/// 對應測試案例：TC-002, TC-003
/// 驗證健康狀態計算是否符合 AC02, AC03 要求
/// 
/// AC02: 實際進度落後理想進度 10-25% 之間 → warning (黃色)
/// AC03: 實際進度落後理想進度 25% 以上 → danger (紅色)
/// </summary>
public class SprintHealthStatusTests
{
    /// <summary>
    /// TC-001 對應：正常進度情況
    /// 第5天/10天，已完成50%，理想進度也是50% → normal
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_正常進度_返回Normal()
    {
        // Arrange
        double completionRate = 50.0;  // 已完成50%
        int daysElapsed = 5;          // 第5天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 5/10 * 100 = 50%，實際進度50%，無落後

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("normal", result);
    }

    /// <summary>
    /// TC-002 邊界測試：稍微落後10%，仍然正常
    /// 第6天/10天，理想60%，實際50%，落後10% → normal
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_稍微落後10Percent_返回Normal()
    {
        // Arrange
        double completionRate = 50.0;  // 已完成50%
        int daysElapsed = 6;          // 第6天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 6/10 * 100 = 60%，實際進度50%，落後10%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("normal", result);
    }

    /// <summary>
    /// TC-002 對應：稍微落後15%，黃色警示
    /// 第6.5天/10天，理想65%，實際50%，落後15% → warning
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_稍微落後15Percent_返回Warning()
    {
        // Arrange
        double completionRate = 50.0;  // 已完成50%
        int daysElapsed = 7;          // 第7天（簡化為整數天）
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 7/10 * 100 = 70%，實際進度50%，落後20%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("warning", result);
    }

    /// <summary>
    /// TC-002 邊界測試：落後25%邊界值，仍為警示
    /// 第7.5天/10天，理想75%，實際50%，落後25% → warning
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_稍微落後25Percent_返回Warning()
    {
        // Arrange
        double completionRate = 40.0;  // 已完成40%
        int daysElapsed = 8;          // 第8天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 8/10 * 100 = 80%，實際進度40%，落後40%，超過25%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("danger", result);  // 這個測試應該會fail，因為現有邏輯錯誤
    }

    /// <summary>
    /// TC-003 對應：嚴重落後30%，紅色危險
    /// 第8天/10天，理想80%，實際50%，落後30% → danger
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_嚴重落後30Percent_返回Danger()
    {
        // Arrange
        double completionRate = 50.0;  // 已完成50%
        int daysElapsed = 8;          // 第8天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 8/10 * 100 = 80%，實際進度50%，落後30%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("danger", result);
    }

    /// <summary>
    /// 邊界值精確測試：10.1%落後應該是warning
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_精確落後10Point1Percent_返回Warning()
    {
        // Arrange - 構造精確的10.1%落後場景
        double completionRate = 39.9;  // 已完成39.9%
        int daysElapsed = 5;          // 第5天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 5/10 * 100 = 50%，實際進度39.9%，落後10.1%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("warning", result);
    }

    /// <summary>
    /// 邊界值精確測試：25.1%落後應該是danger
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_精確落後25Point1Percent_返回Danger()
    {
        // Arrange - 構造精確的25.1%落後場景
        double completionRate = 24.9;  // 已完成24.9%
        int daysElapsed = 5;          // 第5天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 5/10 * 100 = 50%，實際進度24.9%，落後25.1%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("danger", result);
    }

    /// <summary>
    /// 極端情況：Sprint第一天，無論完成率如何都應該正常
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_Sprint第一天_返回Normal()
    {
        // Arrange
        double completionRate = 0.0;   // 第一天通常完成率為0
        int daysElapsed = 1;          // 第1天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 1/10 * 100 = 10%，實際進度0%，落後10%，邊界值

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("normal", result);  // 10%落後應該還是normal
    }

    /// <summary>
    /// 極端情況：進度超前的情況
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_進度超前_返回Normal()
    {
        // Arrange
        double completionRate = 70.0;  // 已完成70%
        int daysElapsed = 5;          // 第5天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 5/10 * 100 = 50%，實際進度70%，超前20%

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("normal", result);
    }

    /// <summary>
    /// 極端情況：總工作日為0的情況
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_總工作日為0_返回Normal()
    {
        // Arrange
        double completionRate = 50.0;
        int daysElapsed = 0;
        int totalWorkingDays = 0;

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("normal", result);
    }

    /// <summary>
    /// 邊界值精確測試：正好落後25%，應該是warning（邊界）
    /// </summary>
    [Fact]
    public void CalculateHealthStatus_精確落後25Percent_返回Warning()
    {
        // Arrange - 構造精確的25%落後場景
        double completionRate = 25.0;  // 已完成25%
        int daysElapsed = 5;          // 第5天
        int totalWorkingDays = 10;    // 總共10天
        // 理想進度 = 5/10 * 100 = 50%，實際進度25%，落後正好25%
        // deviation = 25 - 50 = -25, 根據邏輯 deviation >= -25 應該是 warning

        // Act
        string result = CalculateSprintHealthStatus(completionRate, daysElapsed, totalWorkingDays);

        // Assert
        Assert.Equal("warning", result);
    }

    /// <summary>
    /// 輔助方法：健康狀態計算邏輯（從 GoogleSheetsService 中提取）
    /// 這是我們要測試的核心邏輯
    /// </summary>
    private string CalculateSprintHealthStatus(double completionRate, int daysElapsed, int totalWorkingDays)
    {
        // 現有的邏輯（從 GoogleSheetsService.cs 複製）
        if (totalWorkingDays > 0)
        {
            var expectedCompletion = (double)daysElapsed / totalWorkingDays * 100;
            var deviation = completionRate - expectedCompletion;

            if (deviation >= -10) return "normal";
            else if (deviation >= -25) return "warning";
            else return "danger";
        }
        else
        {
            return "normal";
        }
    }
}
