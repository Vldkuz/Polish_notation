const fs=require('fs');
let Path=process.argv[2];

if (!fs.existsSync(Path)) {
    console.log("Не правильно указан путь к файлу");
    return;
}

let str=fs.readFileSync(Path,'utf-8');
let stack=new Array();
out="";

for (let i=0;i<str.length;++i)
{
    if ((IsOperation(str[i]) && GetPri(str[i]) > GetPri(stack[stack.length-1])) || str[i]=="(" ) stack.push(str[i]);
    else if (IsOperation(str[i]) && GetPri(str[i]) > GetPri(stack[stack.length-1])) stack.push(str[i]);
    else if (!isNaN(str[i]) && str[i]!=" " || str[i]==".") out+=str[i];
    else if (str[i]==" " && out[out.length - 1]!=" ") out+=str[i];
    else if (str[i]==")") {
        while (stack[stack.length-1]!="(")
        {
            if (out[out.length-1]!=" ") out+=" "+stack.pop();
            else out+=stack.pop();
        }

        if (stack[stack.length-1]=="(") stack.pop();
    }
    else if (IsOperation(str[i]) && GetPri(str[i]) <= GetPri(stack[stack.length - 1]))
    {
        while (GetPri(stack[stack.length-1]) >= GetPri(str[i])) {
            if (out[out.length-1]!=" ") out+=" "+stack.pop();
            else out+=stack.pop();
        }

        stack.push(str[i]);
    }
}

while (stack.length>0)
{
    if (out[out.length-1]!=" ") out+=" "+stack.pop();
    else out+=stack.pop();
}

console.log("Выражение в обратной польской записи: ", out);

let temp=out.split(" ",);
for (let i = 0; i < temp.length; i++) {
    if (!isNaN(temp[i]))
    {
        stack.push(temp[i]);
    }
    else
    {
        if (temp[i]=="+") stack.push(Number(stack.pop())+Number(stack.pop()));
        else if (temp[i]=="-") {
            let second=stack.pop();
            let first=stack.pop();
            stack.push(first-second);
        }
        else if (temp[i]=="*") stack.push(stack.pop() * stack.pop())
        else if (temp[i]=="/") 
        {
            let second=stack.pop();
            let first=stack.pop();
            stack.push(first/second);
        }
        else if (temp[i]=="^")
        {
            let second=stack.pop();
            let first=stack.pop();
            stack.push(first**second);
        }
    }
}

console.log("Результат подсчета этого выражения: ",stack.pop());

function IsOperation(operation)
{
    let operations="+-/*^";
    return operations.includes(operation);
}

function GetPri(operation)
{
    let operations=["-+","*/","^"];
    for (let i=0; i < operations.length ; ++i)
    {
        if (operations[i].includes(operation))
        {
            return i;
        }
    }
    return -1;
}
