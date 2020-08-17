; ! --> (Alt) Basic Keymapping

!a::
{
    	Send `;`
}
return

!s::
{
	if getkeystate("capslock","t")
  	{
    		Send L
  	}
	else {
		Send l
  	}
}
return

!d::
{
	if getkeystate("capslock","t")
  	{
    		Send K
  	}
	else {
		Send k
  	}
}
return

!f::
{
	if getkeystate("capslock","t")
  	{
    		Send J
  	}
	else {
		Send j
  	}
}
return

!g::
{
	if getkeystate("capslock","t")
  	{
    		Send H
  	}
	else {
		Send h
  	}
}
return

!z::
{
	Send /
}
return

!x::
{
	Send .
}
return

!c::
{
	Send `,`
}
return

!v::
{
	if getkeystate("capslock","t")
  	{
    		Send M
  	}
	else {
		Send m
  	}
}
return

!b::
{
	if getkeystate("capslock","t")
  	{
    		Send N
  	}
	else {
		Send n
  	}
}
return

!q::
{
	if getkeystate("capslock","t")
  	{
    		Send P
  	}
	else {
		Send p
  	}
}
return

!w::
{
	if getkeystate("capslock","t")
  	{
    		Send O
  	}
	else {
		Send o
  	}
}
return

!e::
{
	if getkeystate("capslock","t")
  	{
    		Send I
  	}
	else {
		Send i
  	}
}
return

!r::
{
	if getkeystate("capslock","t")
  	{
    		Send U
  	}
	else {
		Send u
  	}
}
return

!t::
{
	if getkeystate("capslock","t")
  	{
    		Send Y
  	}
	else {
		Send y
  	}
}
return