namespace Reisekartet.Api.Mutations;

[MutationType]
public class HelloMutation
{
    public string Hello(string name) => $"Hello {name}!";
}
