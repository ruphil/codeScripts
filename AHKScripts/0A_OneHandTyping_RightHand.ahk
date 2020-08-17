; ! --> (Alt) Basic Keymapping

!;::
{
	if getkeystate("capslock","t")
  	{
    		Send A
  	}
	else {
		Send a
  	}
}
return

!l::
{
	if getkeystate("capslock","t")
  	{
    		Send S
  	}
	else {
		Send s
  	}

}
return

!k::
{
	if getkeystate("capslock","t")
  	{
    		Send D
  	}
	else {
		Send d
  	}

}
return

!j::
{
	if getkeystate("capslock","t")
  	{
    		Send F
  	}
	else {
		Send f
  	}

}
return

!h::
{
	if getkeystate("capslock","t")
  	{
    		Send G
  	}
	else {
		Send g
  	}

}
return

!/::
{
	if getkeystate("capslock","t")
  	{
    		Send Z
  	}
	else {
		Send z
  	}

}
return

!.::
{
	if getkeystate("capslock","t")
  	{
    		Send X
  	}
	else {
		Send x
  	}

}
return

!,::
{
	if getkeystate("capslock","t")
  	{
    		Send C
  	}
	else {
		Send c
  	}

}
return

!m::
{
	if getkeystate("capslock","t")
  	{
    		Send V
  	}
	else {
		Send v
  	}

}
return

!n::
{
	if getkeystate("capslock","t")
  	{
    		Send B
  	}
	else {
		Send b
  	}

}
return

!p::
{
	if getkeystate("capslock","t")
  	{
    		Send Q
  	}
	else {
		Send q
  	}

}
return

!o::
{
	if getkeystate("capslock","t")
  	{
    		Send W
  	}
	else {
		Send w
  	}

}
return

!i::
{
	if getkeystate("capslock","t")
  	{
    		Send E
  	}
	else {
		Send e
  	}

}
return

!u::
{
	if getkeystate("capslock","t")
  	{
    		Send R
  	}
	else {
		Send r
  	}

}
return

!y::
{
	if getkeystate("capslock","t")
  	{
    		Send T
  	}
	else {
		Send t
  	}

}
return

; ---------------------------------------------------------------------------------------------------------------------
; !^ --> (Alt + Ctrl) Keymapping in Upper Case

!^;::
{
	Send A
}
return

!^l::
{
	Send S
}
return

!^k::
{
	Send D
}
return

!^j::
{
	Send F
}
return

!^h::
{
	Send G
}
return

!^/::
{
	Send Z
}
return

!^.::
{
	Send X
}
return

!^,::
{
	Send C
}
return

!^m::
{
	Send V
}
return

!^n::
{
	Send B
}
return

!^p::
{
	Send Q
}
return

!^o::
{
	Send W
}
return

!^i::
{
	Send E
}
return

!^u::
{
	Send R
}
return

!^y::
{
	Send T
}
return

; ---------------------------------------------------------------------------------------------------------------------
; !^ --> (Ctrl) Just in Upper Case

^l::
{
	Send L
}
return

^k::
{
	Send K
}
return

^j::
{
	Send J
}
return

^h::
{
	Send H
}
return

^m::
{
	Send M
}
return

^n::
{
	Send N
}
return

^p::
{
	Send P
}
return

^o::
{
	Send O
}
return

^i::
{
	Send I
}
return

^u::
{
	Send U
}
return

^y::
{
	Send Y
}
return